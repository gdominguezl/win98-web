# Spec Delta

## Purpose

A Minesweeper station that gives each office a fixed small board, a reveal window on winning and retro taunts on repeated losses.

## ADDED Requirements

### Requirement: Fixed board per office
The system SHALL open Minesweeper on a fixed board while a team's session runs: Argentina 9x9 with 10 mines, Chile 6x6 with 4 mines, with the level choices disabled.

#### Scenario: Argentina board
- **GIVEN** an Argentina team that started its session
- **WHEN** the team opens Minesweeper
- **THEN** the board is 9x9 with 10 mines and the Game menu level items are disabled

#### Scenario: Chile board
- **GIVEN** a Chile team that started its session
- **WHEN** the team opens Minesweeper
- **THEN** the board is 6x6 with 4 mines

### Requirement: Winning reveals the office text
The system SHALL show a retro dialog with the office text when the team wins: `Codigo: 1` for Argentina and `SECTOR DESBLOQUEADO: BODEGA` for Chile.

#### Scenario: Win
- **GIVEN** a running team session
- **WHEN** the team wins the game
- **THEN** a modal retro dialog shows the office text instead of the high-score prompt

### Requirement: Retro taunts after repeated losses
The system SHALL show a retro taunt message on each loss after three consecutive losses.

#### Scenario: Third loss
- **GIVEN** a running team session
- **WHEN** the team loses three times in a row
- **THEN** a dialog with a taunt appears, and a win resets the count

### Requirement: Normal Minesweeper without a session
The system SHALL leave Minesweeper unchanged when no team session is running.

#### Scenario: No session
- **GIVEN** no running session
- **WHEN** Minesweeper opens
- **THEN** the levels, Custom and the high-score prompt work as before
