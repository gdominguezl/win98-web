# Spec Delta

## ADDED Requirements

### Requirement: Chile teams get PUERTA.BMP
The system SHALL create `C:\My Documents\PUERTA.BMP` while a Chile team's session runs, an image that looks empty and reveals `BUSCA A QUIEN CUIDA QUIÉN ENTRA Y QUIÉN SALE` after the background is filled with another color in Paint.

#### Scenario: Image looks empty
- **GIVEN** a running Chile session
- **WHEN** the team opens `PUERTA.BMP` in Paint
- **THEN** the image looks like a uniform background

#### Scenario: Fill reveals the message
- **GIVEN** `PUERTA.BMP` open in Paint
- **WHEN** the team floods the background with Fill With Color
- **THEN** the message and the doorbell become readable in the original color

#### Scenario: File removed
- **GIVEN** a session that stops running
- **WHEN** the station is removed
- **THEN** `PUERTA.BMP` no longer exists

### Requirement: Paint File > Open defaults to the BMP type during a Chile session
The system SHALL preselect `24-bit Bitmap (*.bmp;*.dib)` in the "Files of type" selection of Paint's Open dialog while a Chile session runs, so `PUERTA.BMP` is listed without a manual filter change.

#### Scenario: Dialog preselects the BMP type
- **GIVEN** a running Chile session and `PUERTA.BMP` in `C:\My Documents`
- **WHEN** the team opens File > Open in Paint
- **THEN** the selected type is `24-bit Bitmap (*.bmp;*.dib)` and `PUERTA.BMP` appears in the file list

#### Scenario: Default restored after the session
- **GIVEN** a Chile session that stopped running
- **WHEN** a user opens File > Open in Paint
- **THEN** the "Files of type" selection is the default first entry

#### Scenario: Other sessions unaffected
- **GIVEN** an Argentina session or no session
- **WHEN** a user opens File > Open in Paint
- **THEN** the "Files of type" selection is the default first entry
