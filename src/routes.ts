// Components
import LogGroups from './pages/LogGroups.svelte'
import LogGroupDetails from './pages/LogGroupDetails.svelte'
import LogGroupSearch from './pages/LogGroupSearch.svelte'

// Export the route definition object
export default {
    // Exact path
    '/log-groups': LogGroups,

    // Using named parameter
    '/log-groups/:logGroupAuditFileId/details': LogGroupDetails,
    '/log-groups/:logGroupAuditFileId/search': LogGroupSearch
}