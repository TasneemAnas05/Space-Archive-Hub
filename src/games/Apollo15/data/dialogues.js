// All dialogue trees for Apollo 15.
// Each entry: { id, lines: [{ speaker, speakerName, text }] }
// speaker keys map to portraits in DialogueBox.

export const DIALOGUES = {

  lm_examine: {
    id: 'lm_examine',
    lines: [
      { speaker: 'narrator', speakerName: 'Mission Data', text: 'LM-10 "Falcon" — Descent stage intact. 350 kg of descent propellant consumed on the way down. The Apennines loom 4,500 m above you to the south.' },
      { speaker: 'houston', speakerName: 'Houston (Capcom)', text: 'Falcon, Houston. Confirm touchdown at Hadley Base. You\'re looking great from down here.' },
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'Man, this is the most beautiful place I\'ve ever been. What a spectacular view.' },
    ],
  },

  scott_intro: {
    id: 'scott_intro',
    lines: [
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'Outstanding! What a beautiful place to be up here — look at those mountains.' },
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'First order of business — we need to plant the colors. The flag kit should be just south of the LM.' },
      { speaker: 'houston', speakerName: 'Houston', text: 'Roger that, Dave. You\'re in the shadow of Mt. Hadley. Take your time. We\'ve got 66 hours.' },
    ],
  },

  flag_plant: {
    id: 'flag_plant',
    lines: [
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'I\'d like to dedicate the first step of Apollo 15 to all those who make it possible.' },
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'As we stand here, we\'re joined by those who came before us — Yuri, Gus, Ed, Roger, and all the rest.' },
      { speaker: 'houston', speakerName: 'Houston', text: 'Beautiful, Dave. The whole world is watching. How does the flag look?' },
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'Absolutely perfect. Right at the base of the Apennines. Ready to get the LRV.' },
    ],
  },

  lrv_board: {
    id: 'lrv_board',
    lines: [
      { speaker: 'irwin', speakerName: 'LMP Irwin', text: 'First time a car\'s been driven on the Moon! Ready when you are, Dave.' },
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'Nav system is up. Distance reading — zero. Okay, Houston, the Rover is GO!' },
      { speaker: 'narrator', speakerName: 'Mission Data', text: 'The LRV weighs 210 kg, travels up to 14 km/h, and has a range of 92 km. Its T-handle joystick steers all four wheels. Press ← → to drive, E to dismount.' },
    ],
  },

  rock_basalt: {
    id: 'rock_basalt',
    lines: [
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'Got a vesicular basalt here. Probably extruded from Hadley Rille in the distant past.' },
      { speaker: 'houston', speakerName: 'Houston (Geology)', text: 'Copy that. Bag it up. These basalts will tell us about lunar volcanic history.' },
    ],
  },

  rock_mare: {
    id: 'rock_mare',
    lines: [
      { speaker: 'irwin', speakerName: 'LMP Irwin', text: 'Dark material here — mare soil. Remarkably fine-grained.' },
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'Collecting about 200 grams. This one looks like it was shaken loose from the rille wall.' },
    ],
  },

  genesis_rock: {
    id: 'genesis_rock',
    lines: [
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'Look at that, Jim! Almost entirely plagioclase.' },
      { speaker: 'irwin', speakerName: 'LMP Irwin', text: 'Guess what we just found.' },
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'I think we found what we came for!' },
      { speaker: 'houston', speakerName: 'Houston (Geology)', text: 'Beautiful! It\'s a crystalline rock — anorthosite. This may be a piece of the original lunar crust.' },
      { speaker: 'narrator', speakerName: 'Mission Data', text: 'Sample 15415 — the "Genesis Rock" — is 4.5 billion years old, nearly as ancient as the Moon itself. It became one of the most significant geological finds of the Apollo program.' },
    ],
  },

  irwin_intro: {
    id: 'irwin_intro',
    lines: [
      { speaker: 'irwin', speakerName: 'LMP Irwin', text: 'Dave, the ALSEP site looks perfect here. Good flat ground. We should deploy before EVA-2 runs long.' },
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'Agreed. Let\'s get the RTG out first, then the heat flow sensors.' },
    ],
  },

  alsep_deploy: {
    id: 'alsep_deploy',
    lines: [
      { speaker: 'irwin', speakerName: 'LMP Irwin', text: 'Central station — deployed. Passive seismometer aligned to north.' },
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'Heat flow experiment — both probes are in. Magnetometer is level.' },
      { speaker: 'houston', speakerName: 'Houston', text: 'Telemetry is live on all instruments. ALSEP is nominal. Outstanding deployment, guys.' },
      { speaker: 'narrator', speakerName: 'Mission Data', text: 'The ALSEP at Hadley Base transmitted data back to Earth until September 30, 1977 — over 6 years after Apollo 15 left the Moon.' },
    ],
  },

  hammer_feather: {
    id: 'hammer_feather',
    lines: [
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'Well, in my left hand I have a feather — a falcon feather from our mascot. In my right, a geological hammer.' },
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'Galileo dropped things from the Tower of Pisa and stated that all objects fall at the same rate, regardless of mass.' },
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'I\'ll drop the two of them here and hopefully they\'ll hit at the same time.' },
      { speaker: 'narrator', speakerName: 'Mission Data', text: '— [Both objects fall together and strike the surface simultaneously] —' },
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'How about that! Mr. Galileo was correct in his findings.' },
      { speaker: 'houston', speakerName: 'Houston', text: 'Superb. Absolutely superb!' },
    ],
  },

  hadley_rille: {
    id: 'hadley_rille',
    lines: [
      { speaker: 'irwin', speakerName: 'LMP Irwin', text: 'What a view! What a view!' },
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'As I stand here in the wonders of the unknown at Hadley, I sort of realize there\'s a fundamental truth to our nature.' },
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'Man must explore. And this is exploration at its greatest.' },
      { speaker: 'narrator', speakerName: 'Mission Data', text: 'Hadley Rille is approximately 1.5 km wide and 300 m deep, carved billions of years ago by flowing lava tubes that collapsed. At its exposed wall, you can see layers of mare basalt — a window into 3.3 billion years of lunar history.' },
    ],
  },

  return_lm_early: {
    id: 'return_lm_early',
    lines: [
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'We\'re not done out here yet. Still have objectives to complete before we can pack it in.' },
    ],
  },

  return_lm_final: {
    id: 'return_lm_final',
    lines: [
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'Alright, Jim. All objectives complete. What a day. What a day.' },
      { speaker: 'irwin', speakerName: 'LMP Irwin', text: 'That Genesis Rock alone makes the whole trip worthwhile.' },
      { speaker: 'houston', speakerName: 'Houston', text: 'Falcon crew, that was one of the finest EVAs we\'ve ever seen. Outstanding work. Come on home.' },
      { speaker: 'scott', speakerName: 'CDR Scott', text: 'Roger. Ascending back to Endeavour. See you in orbit, Al.' },
    ],
  },

}
