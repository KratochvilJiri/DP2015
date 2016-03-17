module.exports = {
    'ADMINISTRATOR': {
        UserModuleRead: true,
        ConferenceAdministrationModuleRead: true,
        ConferenceParticipantModuleRead: false,
        ParticipantsModuleRead: true,
        AdministatorDashboardModule: true,
        ParticipantDashboardModule: false,
    },
    'CONTACT_PERSON': {
        UserModuleRead: false,
        ConferenceAdministrationModuleRead: false,
        ConferenceParticipantModuleRead: false,
        ParticipantsModuleRead: true,
        AdministatorDashboardModule: true,
        ParticipantDashboardModule: false,
    },
    'PARTICIPANT': {
        UserModuleRead: false,
        ConferenceAdministrationModuleRead: false,
        ConferenceParticipantModuleRead: true,
        ParticipantsModuleRead: false,
        AdministatorDashboardModule: false,
        ParticipantDashboardModule: true,
    }
}