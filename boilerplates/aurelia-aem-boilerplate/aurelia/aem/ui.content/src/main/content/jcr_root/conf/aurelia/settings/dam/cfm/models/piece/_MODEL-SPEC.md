# CF Model: Piece  →  /conf/aurelia/settings/dam/cfm/models/piece

Create this model in **Tools → Assets → Content Fragment Models** (Adobe recommends
authoring it in the UI and then exporting it to this package). Fields:

| Field label   | Property name | Field type               | Notes                                   |
|---------------|---------------|--------------------------|-----------------------------------------|
| Name          | name          | Single line text         | Localizable (translation via rollout)   |
| Collection    | collection    | Single line text         | Localizable                             |
| Metal         | metal         | Single line text         | Localizable                             |
| Gemstone      | gemstone      | Single line text         | Localizable                             |
| Notes         | notes         | Multi line text          | Localizable                             |
| Carat         | carat         | Single line text         | e.g. "0.90 ct"                          |
| Ref           | ref           | Single line text         | e.g. "AU-SEL-01"                        |
| Image         | image         | Content Reference        | Points to the DAM asset                 |
| Image Alt     | imageAlt      | Single line text         | Alternative text                        |

The getters in `PieceModel.java` use exactly these property names.

## Instances (Content Fragments)
Create the fragments under **/content/dam/aurelia/pieces/**, one per piece.
Values taken from `server/src/data/gallery.json` of the standalone project:

- **selene** (ref AU-SEL-01, carat 0.90 ct)
  - ES: name="Solitario Selene", collection="Celeste", metal="Oro blanco 18k", gemstone="Diamante", notes="Talla brillante, montura de seis garras"
  - EN: name="Selene Solitaire", collection="Celeste", metal="18k white gold", gemstone="Diamond", notes="Brilliant cut, six-prong setting"
  - image (DAM): /content/dam/aurelia/pieces/selene.jpg

- **herencia** (ref AU-HER-02, carat 2.40 ct)
  - ES: name="Collar Herencia", collection="Raíces", metal="Oro amarillo 18k", gemstone="Esmeralda", notes="Esmeralda colombiana, engaste bisel"
  - EN: name="Herencia Necklace", collection="Roots", metal="18k yellow gold", gemstone="Emerald", notes="Colombian emerald, bezel setting"
  - image (DAM): /content/dam/aurelia/pieces/herencia.jpg

- **rocio** (ref AU-ROC-03, carat 1.10 ct)
  - ES: name="Aretes Rocío", collection="Jardín", metal="Oro rosa 18k", gemstone="Zafiro", notes="Zafiros azules pareados, cierre de presión"
  - EN: name="Rocio Earrings", collection="Garden", metal="18k rose gold", gemstone="Sapphire", notes="Matched blue sapphires, push-back clasp"
  - image (DAM): /content/dam/aurelia/pieces/rocio.jpg

- **marea** (ref AU-MAR-04, carat 3.50 ct)
  - ES: name="Pulsera Marea", collection="Océano", metal="Plata 950", gemstone="Aguamarina", notes="Eslabones a mano, aguamarina talla cojín"
  - EN: name="Marea Bracelet", collection="Ocean", metal="950 silver", gemstone="Aquamarine", notes="Hand-forged links, cushion-cut aquamarine"
  - image (DAM): /content/dam/aurelia/pieces/marea.jpg

- **brasa** (ref AU-BRA-05, carat 1.30 ct)
  - ES: name="Anillo Brasa", collection="Fuego", metal="Oro amarillo 18k", gemstone="Rubí", notes="Rubí birmano, halo de diamantes"
  - EN: name="Brasa Ring", collection="Fire", metal="18k yellow gold", gemstone="Ruby", notes="Burmese ruby, diamond halo"
  - image (DAM): /content/dam/aurelia/pieces/brasa.jpg

- **aurora** (ref AU-AUR-06, carat 2.00 ct)
  - ES: name="Dije Aurora", collection="Celeste", metal="Oro blanco 18k", gemstone="Ópalo", notes="Ópalo boulder, cadena veneciana"
  - EN: name="Aurora Pendant", collection="Celeste", metal="18k white gold", gemstone="Opal", notes="Boulder opal, Venetian chain"
  - image (DAM): /content/dam/aurelia/pieces/aurora.jpg
