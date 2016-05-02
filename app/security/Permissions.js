module.exports = {
    'ADMINISTRATOR': {
        UserModuleRead: true,
        ConferenceAdministrationModuleRead: true,
        ConferenceParticipantModuleRead: false,
        ParticipantsModuleRead: true,
        AdministatorDashboardModule: true,
        ParticipantDashboardModule: false,
        ParticipantAdministration: true,
        Administration: true,
        ContactPersonAdministration: true,
        ContactPersonOnly: false
    },
    'CONTACT_PERSON': {
        UserModuleRead: false,
        ConferenceAdministrationModuleRead: false,
        ConferenceParticipantModuleRead: false,
        ParticipantsModuleRead: true,
        AdministatorDashboardModule: true,
        ParticipantDashboardModule: false,
        ParticipantAdministration: true,
        ContactPersonAdministration: false,
        Administration: false,
        ContactPersonOnly: true
    },
    'PARTICIPANT': {
        UserModuleRead: false,
        ConferenceAdministrationModuleRead: false,
        ConferenceParticipantModuleRead: true,
        ParticipantsModuleRead: false,
        AdministatorDashboardModule: false,
        ParticipantDashboardModule: true,
        ParticipantAdministration: false,
        ContactPersonAdministration: false,
        Administration: false,
        ContactPersonOnly: false
    }
}