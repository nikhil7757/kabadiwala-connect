# On-Device Material Classifier Dataset (data/ml)

> **Rule (PRD Section 7 & TRD Section 12.6)**: Document image counts per class, lighting conditions, train/validation split, validation accuracy, and limitations. Never invent or falsify accuracy metrics.

---

## Model Status

- **Current Status**: **Model not yet trained**. Prototype operates in manual selection mode.
- **Inference Engine**: `@tensorflow/tfjs` lazy-loaded on the client on first lot creation.
- **Export Format Target**: Google Teachable Machine / Keras export (`model.json`, `weights.bin`, `metadata.json`) located at `apps/web/public/model/`.
- **Target Confidence Threshold**: `>= 0.60` triggers suggested material chip; lower scores trigger `"Not sure. Please choose."`

---

## Dataset Specification (For Team Field Photo Collection)

### Target Classes (Exact Match with MaterialCategory.code)

| Class Code | English Label | Recommended Sample Size | Capture Guidelines |
| :--- | :--- | :--- | :--- |
| `CABLE` | Cables and wires | 150+ images | Coiled wires, cut cords, copper cables, varied sunlight |
| `PCB` | Circuit boards | 150+ images | Motherboards, mobile PCBs, component-dense boards |
| `BATTERY` | Batteries | 100+ images | Lead-acid, laptop cell packs, swelling variations |
| `CRT` | Old TV or CRT monitor | 80+ images | Bulky glass monitor casings, television backings |
| `LCD` | Flat screen or LCD | 100+ images | Thin flatscreens, cracked displays, laptop panels |
| `MOTOR` | Motors and magnets | 100+ images | Fan armatures, copper coil motors, HDD magnets |
| `PLASTIC` | Mixed plastic casing | 100+ images | Shredded e-waste casings, printer shells, dark polymers |
| `OTHER` | Other e-waste | 80+ images | Chargers, small mixed gadgets, transformers |

### Validation Split
- **Training**: 80%
- **Validation**: 20%
- **Measured Accuracy**: `[Pending real training dataset]`
