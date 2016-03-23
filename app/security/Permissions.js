module.exports = {
    'ADMINISTRATOR': {
        UserModuleRead: true,
        ConferenceAdministrationModuleRead: true,
        ConferenceParticipantModuleRead: false,
        ParticipantsModuleRead: true,
        AdministatorDashboardModule: true,
        ParticipantDashboardModule: false,
        ParticipantAdministration: true,
    },
    'CONTACT_PERSON': {
        UserModuleRead: false,
        ConferenceAdministrationModuleRead: false,
        ConferenceParticipantModuleRead: false,
        ParticipantsModuleRead: true,
        AdministatorDashboardModule: true,
        ParticipantDashboardModule: false,
        ParticipantAdministration: true,
    },
    'PARTICIPANT': {
        UserModuleRead: false,
        ConferenceAdministrationModuleRead: false,
        ConferenceParticipantModuleRead: true,
        ParticipantsModuleRead: false,
        AdministatorDashboardModule: false,
        ParticipantDashboardModule: true,
        ParticipantAdministration: false,
    }
}