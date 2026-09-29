# Audio Recordings Directory (apps/web/public/audio)

> **Rule (PRD Section 13 & TRD Section 12.7)**: Pre-recorded audio files for low-literacy collectors. Real human voice recordings only. Until native speakers record these clips, the application automatically falls back to `speechSynthesis` (`hi-IN`, `mr-IN`, `en-IN`). Do not commit computer-generated audio pretending to be human recordings.

---

## Directory Structure

```text
apps/web/public/audio/
├── hi/       # Hindi MP3 audio clips
├── mr/       # Marathi MP3 audio clips
└── en/       # English MP3 audio clips
```

## Required Audio Keys & Files (`<key>.mp3`)

| Audio Key | Description / Prompt Content |
| :--- | :--- |
| `welcome_greeting` | "Welcome to Kabadiwala Connect. Please choose your language." |
| `choose_language` | Prompt to tap Hindi, Marathi, or English |
| `enter_phone` | "Please enter your 10-digit mobile number." |
| `enter_code` | "Enter the 6-digit code received." |
| `code_wrong` | "The code entered is incorrect. Please try again." |
| `take_photo` | "Take clear photos of your scrap material." |
| `choose_material` | "What type of e-waste is this?" |
| `mat_cable` | "Cables and wires" |
| `mat_pcb` | "Circuit boards" |
| `mat_battery` | "Batteries" |
| `mat_crt` | "Old TV or CRT monitor" |
| `mat_lcd` | "Flat screen or LCD" |
| `mat_motor` | "Motors and magnets" |
| `mat_plastic` | "Mixed plastic casing" |
| `mat_other` | "Other e-waste" |
| `enter_weight` | "Enter the approximate weight in kilograms." |
| `estimate_intro` | "Here is your estimated value based on today's rates." |
| `num_0` to `num_9` | Spoken digits zero through nine |
| `num_hundred` | Spoken "hundred" (सौ / शंभर) |
| `num_thousand` | Spoken "thousand" (हज़ार / हजार) |
| `rupees` | Spoken "rupees" (रुपये) |
| `rates_old` | "These rates may be older than seven days." |
| `find_buyer` | "Find nearby authorized recyclers." |
| `buyer_chosen` | "Authorized buyer selected." |
| `quote_received` | "You have received a price offer from the buyer." |
| `accept_quote` | "Price accepted." |
| `start_handover` | "Ready to hand over scrap to the buyer." |
| `show_code_to_buyer` | "Show this 6-digit code or QR code to the buyer." |
| `handover_confirmed` | "Handover confirmed and recorded in trace chain." |
| `lot_saved` | "Lot saved successfully." |
| `offline_saved` | "Offline. Your work is saved safely on this phone." |
| `synced` | "All lots synchronized with server." |
| `sync_failed` | "Could not sync. Will retry when connected." |
| `no_buyer_near` | "No authorized buyer near you for this material yet." |
| `price_board_intro` | "Today's prevailing buying rates per kilogram." |
| `earnings_intro` | "Summary of received and pending payments." |
| `safety_burning` | "Never burn cables. The smoke is toxic poison." |
| `safety_crt` | "Never open a CRT television tube. Carry with both hands." |
| `safety_battery` | "Keep batteries dry and apart. Avoid puncture or heat." |
| `safety_acid` | "Never pour acid on circuit boards." |
| `safety_gloves` | "Wear protective gloves when sorting scrap." |
| `safety_children` | "Keep children away from e-waste storage areas." |
| `safety_understand` | "Understood and acknowledged." |
