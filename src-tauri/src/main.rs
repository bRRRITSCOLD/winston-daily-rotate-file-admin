#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::fs::File;
use std::fs;
use flate2::read::GzDecoder;
use std::io::Read;
use std::path::Path;

mod cmd;

fn main() {
  tauri::AppBuilder::new()
    .invoke_handler(|_webview, arg| {
      use cmd::Cmd::*;
      match serde_json::from_str(arg) {
        Err(e) => {
          Err(e.to_string())
        }
        Ok(command) => {
          match command {
            // definitions for your custom commands from Cmd here
            DecodeGzFile {
              argument,
              callback,
              error,
            } => {
              // tauri::execute_promise is a helper for APIs that uses the tauri.promisified JS function
              // so you can easily communicate between JS and Rust with promises
              tauri::execute_promise(
                _webview,
                move || {
                  println!("{}", argument);
                  let gz = File::open(argument)?;
                  let mut decompressed_gz = GzDecoder::new(gz);
                  let mut s = String::new();
                  decompressed_gz.read_to_string(&mut s)?;
                  Ok(s)
                },
                callback,
                error,
              )
            }

            GetAppDirPath {
              callback,
              error
            } => {
              // tauri::execute_promise is a helper for APIs that uses the tauri.promisified JS function
              // so you can easily communicate between JS and Rust with promises
              tauri::execute_promise(
                _webview,
                move || {
                  Ok(tauri::api::path::app_dir().unwrap())
                },
                callback,
                error,
              )
            }

            DoesFileExist {
              argument,
              callback,
              error
            } => {
              // tauri::execute_promise is a helper for APIs that uses the tauri.promisified JS function
              // so you can easily communicate between JS and Rust with promises
              tauri::execute_promise(
                _webview,
                move || {
                  Ok(Path::new(&argument).exists())
                },
                callback,
                error,
              )
            }

            Mkdirp {
              argument,
              callback,
              error
            } => {
              // tauri::execute_promise is a helper for APIs that uses the tauri.promisified JS function
              // so you can easily communicate between JS and Rust with promises
              tauri::execute_promise(
                _webview,
                move || {
                  fs::create_dir_all(argument)?;
                  Ok(true)
                },
                callback,
                error,
              )
            }
          }
          Ok(())
        }
      }
    })
    .build()
    .run();
}
