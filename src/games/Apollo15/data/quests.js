// Quest definitions for Apollo 15.
// Quests unlock sequentially — each completion activates the next.
// Every objective maps 1-to-1 with an entity interaction.

export const QUEST_DEFS = [
  {
    id: 'first_contact',
    title: 'First Steps',
    subtitle: 'EVA-1 — Day 1',
    description: 'Make contact with Commander Scott after landing.',
    icon: '👨‍🚀',
    objectives: [
      { id: 'talk_to_scott', label: 'Talk to Commander Scott' },
    ],
  },
  {
    id: 'plant_flag',
    title: 'Plant the Colors',
    subtitle: 'EVA-1 — Day 1',
    description: 'Plant the American flag at Hadley Base.',
    icon: '🚩',
    objectives: [
      { id: 'plant_flag_obj', label: 'Plant the flag near LM Falcon' },
    ],
  },
  {
    id: 'geo_survey',
    title: 'Geological Survey',
    subtitle: 'EVA-1 & EVA-2',
    description: 'Collect lunar samples with the LRV across the site.',
    icon: '🪨',
    objectives: [
      { id: 'board_lrv',    label: 'Board the Lunar Roving Vehicle' },
      { id: 'sample_a',     label: 'Collect basalt sample near St. George' },
      { id: 'sample_b',     label: 'Collect mare soil near Hadley Delta' },
      { id: 'genesis_rock', label: 'Retrieve the Genesis Rock' },
    ],
  },
  {
    id: 'deploy_alsep',
    title: 'Deploy ALSEP',
    subtitle: 'EVA-2 — Day 2',
    description: 'Set up the Apollo Lunar Surface Experiments Package.',
    icon: '📡',
    objectives: [
      { id: 'talk_to_irwin',    label: 'Coordinate with LMP Irwin' },
      { id: 'deploy_alsep_obj', label: 'Deploy ALSEP instruments' },
    ],
  },
  {
    id: 'galileo_exp',
    title: "Galileo's Test",
    subtitle: 'EVA-3 — Day 3',
    description: 'Perform the hammer-and-feather gravity demonstration.',
    icon: '🔨',
    objectives: [
      { id: 'hammer_feather_obj', label: 'Drop hammer and feather together' },
    ],
  },
  {
    id: 'hadley_rille_quest',
    title: 'Edge of the Rille',
    subtitle: 'EVA-3 — Day 3',
    description: 'Reach Hadley Rille and document it for science.',
    icon: '🏔️',
    objectives: [
      { id: 'photograph_rille', label: 'Photograph Hadley Rille from the edge' },
    ],
  },
  {
    id: 'return_mission',
    title: 'Return to Falcon',
    subtitle: 'EVA-3 — End',
    description: 'Complete your EVA and return to the lunar module.',
    icon: '🚀',
    objectives: [
      { id: 'board_lm', label: 'Board LM Falcon to ascend' },
    ],
  },
]
