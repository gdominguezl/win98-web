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
