# Spec Delta

## ADDED Requirements

### Requirement: Chile teams get MORSE.TXT
The system SHALL create `C:\My Documents\MORSE.TXT` with a Morse translation table and three transmissions while a Chile team's session is running, without changing the contents of `C:\THROWBACK`.

#### Scenario: Content
- **GIVEN** a Chile team that started its session
- **WHEN** the team opens `MORSE.TXT`
- **THEN** a letter table is followed by transmissions 01, 02 and 03 with the exact Morse text
- **AND** transmission 02 decodes to `TELEVISOR` with the table

#### Scenario: THROWBACK unchanged
- **GIVEN** the running Chile session
- **WHEN** the team lists `C:\THROWBACK`
- **THEN** it still shows only `MEMORY.TXT`, `ERROR.LOG` and `PLANO.TXT`

#### Scenario: File removed
- **GIVEN** a session that stops running
- **WHEN** the station is removed
- **THEN** `MORSE.TXT` no longer exists
