// Entity definitions for the Apollo 15 lunar surface world.
// x — world-space pixel position (world is 3200px wide).
// All entity state is initialised to 'idle'; the game mutates it.

export const ENTITY_DEFS = [
  // ── Structures ──────────────────────────────────────────────────────────
  {
    id: 'lm_falcon',
    type: 'structure',
    label: 'LM Falcon',
    x: 130,
    interactLabel: 'Examine LM Falcon',
    dialogueId: 'lm_examine',
    questTrigger: null,
    permanent: true,  // never disappears
  },

  // ── NPC: Scott ──────────────────────────────────────────────────────────
  {
    id: 'scott',
    type: 'npc',
    label: 'CDR Scott',
    x: 310,
    interactLabel: 'Talk to Commander Scott',
    dialogueId: 'scott_intro',
    questTrigger: { questId: 'first_contact', objectiveId: 'talk_to_scott' },
  },

  // ── Item: Flag Kit ───────────────────────────────────────────────────────
  {
    id: 'flag_kit',
    type: 'flag',
    label: 'Flag Kit',
    x: 220,
    interactLabel: 'Plant the Flag',
    dialogueId: 'flag_plant',
    questTrigger: { questId: 'plant_flag', objectiveId: 'plant_flag_obj' },
    // After interaction renders as planted flag (state → 'done')
  },

  // ── Vehicle: LRV ────────────────────────────────────────────────────────
  {
    id: 'lrv',
    type: 'vehicle',
    label: 'Lunar Rover',
    x: 540,
    interactLabel: 'Board LRV',
    dialogueId: 'lrv_board',
    questTrigger: { questId: 'geo_survey', objectiveId: 'board_lrv' },
    isVehicle: true,
  },

  // ── Samples ──────────────────────────────────────────────────────────────
  {
    id: 'rock_a',
    type: 'sample',
    label: 'Basalt Sample',
    x: 820,
    interactLabel: 'Collect Sample',
    dialogueId: 'rock_basalt',
    questTrigger: { questId: 'geo_survey', objectiveId: 'sample_a' },
    variant: 'basalt',
  },
  {
    id: 'rock_b',
    type: 'sample',
    label: 'Mare Soil',
    x: 1250,
    interactLabel: 'Collect Sample',
    dialogueId: 'rock_mare',
    questTrigger: { questId: 'geo_survey', objectiveId: 'sample_b' },
    variant: 'mare',
  },
  {
    id: 'genesis_rock',
    type: 'sample',
    label: '???',          // reveals name after collection
    x: 1700,
    interactLabel: 'Examine Rock',
    dialogueId: 'genesis_rock',
    questTrigger: { questId: 'geo_survey', objectiveId: 'genesis_rock' },
    variant: 'genesis',
  },

  // ── NPC: Irwin ───────────────────────────────────────────────────────────
  {
    id: 'irwin',
    type: 'npc',
    label: 'LMP Irwin',
    x: 1900,
    interactLabel: 'Talk to LMP Irwin',
    dialogueId: 'irwin_intro',
    questTrigger: { questId: 'deploy_alsep', objectiveId: 'talk_to_irwin' },
  },

  // ── ALSEP Site ───────────────────────────────────────────────────────────
  {
    id: 'alsep_site',
    type: 'alsep',
    label: 'ALSEP Site',
    x: 2150,
    interactLabel: 'Deploy ALSEP',
    dialogueId: 'alsep_deploy',
    questTrigger: { questId: 'deploy_alsep', objectiveId: 'deploy_alsep_obj' },
  },

  // ── Experiment ───────────────────────────────────────────────────────────
  {
    id: 'hammer_feather',
    type: 'item',
    label: 'Hammer & Feather',
    x: 2500,
    interactLabel: 'Conduct Experiment',
    dialogueId: 'hammer_feather',
    questTrigger: { questId: 'galileo_exp', objectiveId: 'hammer_feather_obj' },
  },

  // ── Hadley Rille ─────────────────────────────────────────────────────────
  {
    id: 'hadley_rille',
    type: 'rille',
    label: 'Hadley Rille',
    x: 2900,
    interactLabel: 'Photograph Rille',
    dialogueId: 'hadley_rille',
    questTrigger: { questId: 'hadley_rille_quest', objectiveId: 'photograph_rille' },
  },

  // ── Return ───────────────────────────────────────────────────────────────
  // Uses LM structure at x=130 — handled separately via isReturn flag on the LM
  // when quest 'return_mission' is active.
]
