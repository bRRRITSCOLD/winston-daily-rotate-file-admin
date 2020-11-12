// Components
import LogGroups from './pages/LogGroups.svelte'
import LogGroupDetails from './pages/LogGroupDetails.svelte'
import LogGroupSearch from './pages/LogGroupSearch.svelte'

// Export the route definition object
export default {
    // Exact path
    '/log-groups': LogGroups,

    // Using named parameter
    '/log-groups/:logGroupId/details': LogGroupDetails,
    '/log-groups/:logGroupId/details/search': LogGroupSearch
}