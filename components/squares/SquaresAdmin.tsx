"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { SquaresGrid } from "@/components/squares/SquaresGrid"
import { getContrastColor } from "@/lib/squaresColors"
import {
  getSquaresState,
  saveSquaresState,
  initPlayersFromProps,
  addSquaresPlayer,
  renameSquaresPlayer,
  removeSquaresPlayer,
  updatePlayerColor,
  getBaseLimit,
  getRemainder,
  getPlayerLimit,
  getPlayerClaimedCount,
  getTotalClaimed,
  getUnclaimedCount,
  canAssignExtras,
  assignExtraSquares,
  adminPlaceForPlayer,
  autoFillPlayer,
  lockBoard,
  unlockBoard,
  canRandomize,
  randomizeNumbers,
  computeWinner,
  recordWinner,
  clearWinner,
  adminClearSquare,
  flipOrientation,
  exportSquaresBackup,
  importSquaresBackup,
  isBaseRoundComplete,
} from "@/lib/squaresStore"
import type { SquaresState } from "@/lib/squaresTypes"
import type { ComputeWinnerResult } from "@/lib/squaresStore"

const CHECKPOINTS: ("Q1" | "Q2" | "Q3" | "Final")[] = ["Q1", "Q2", "Q3", "Final"]

export function SquaresAdmin() {
  const [sqState, setSqState] = useState<SquaresState | null>(null)
  const [newPlayerName, setNewPlayerName] = useState("")
  const [addPlayerError, setAddPlayerError] = useState("")
  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [placingForId, setPlacingForId] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<string, { patriots: string; seahawks: string }>>({})
  const [computedResult, setComputedResult] = useState<ComputeWinnerResult | null>(null)
  const [confirmingCheckpoint, setConfirmingCheckpoint] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [confirmAction, setConfirmAction] = useState<{
    title: string
    description: string
    confirmLabel: string
    onConfirm: () => void
    variant: "default" | "destructive"
  } | null>(null)

  const refresh = () => setSqState(getSquaresState())

  useEffect(() => {
    refresh()
  }, [])

  if (!sqState) return null

  const playerCount = sqState.players.length
  const baseLimit = getBaseLimit(playerCount)
  const remainder = getRemainder(playerCount)
  const totalClaimed = getTotalClaimed(sqState)
  const unclaimed = getUnclaimedCount(sqState)

  // --- Section A: Players ---
  const handleAddPlayer = () => {
    const trimmed = newPlayerName.trim()
    if (!trimmed) {
      setAddPlayerError("Name cannot be empty")
      return
    }
    if (sqState.players.some((p) => p.name === trimmed)) {
      setAddPlayerError("Player already exists")
      return
    }
    addSquaresPlayer(trimmed)
    setNewPlayerName("")
    setAddPlayerError("")
    refresh()
  }

  const handleRenameSubmit = () => {
    if (!renameId) return
    renameSquaresPlayer(renameId, renameValue)
    setRenameId(null)
    setRenameValue("")
    refresh()
  }

  const handleRemovePlayer = (id: string, name: string) => {
    setConfirmAction({
      title: `Remove ${name}?`,
      description: `This will remove ${name} and clear all their squares.`,
      confirmLabel: "Remove",
      variant: "destructive",
      onConfirm: () => { removeSquaresPlayer(id); refresh() },
    })
  }

  const handleInitFromProps = () => {
    initPlayersFromProps()
    refresh()
  }

  // --- Section B: Board ---
  const handleAssignExtras = () => {
    setConfirmAction({
      title: "Assign Extra Squares",
      description: `${remainder} players will be randomly selected to receive 1 extra square each. You will then place their extra squares manually on the board.`,
      confirmLabel: "Assign",
      variant: "default",
      onConfirm: () => { assignExtraSquares(); refresh() },
    })
  }

  const handlePlaceExtra = (row: number, col: number) => {
    if (!placingForId) return
    const player = sqState.players.find((p) => p.id === placingForId)
    if (!player) return
    setConfirmAction({
      title: `Assign to ${player.name}?`,
      description: `Assign this square to ${player.name}?`,
      confirmLabel: "Assign",
      variant: "default",
      onConfirm: () => {
        adminPlaceForPlayer(placingForId, row, col)
        setPlacingForId(null)
        refresh()
      },
    })
  }

  const handleAutoFill = (id: string, name: string) => {
    const remaining = getPlayerLimit(sqState, id) - getPlayerClaimedCount(sqState, id)
    if (remaining <= 0) return
    setConfirmAction({
      title: `Auto-Fill ${name}?`,
      description: `This will randomly fill ${name}'s remaining ${remaining} squares. Continue?`,
      confirmLabel: "Auto-Fill",
      variant: "default",
      onConfirm: () => { autoFillPlayer(id); refresh() },
    })
  }

  const handleAutoFillAll = () => {
    setConfirmAction({
      title: "Auto-Fill All Players?",
      description: "This will randomly fill all remaining squares for every player. Continue?",
      confirmLabel: "Auto-Fill All",
      variant: "default",
      onConfirm: () => {
        for (const p of sqState.players) {
          autoFillPlayer(p.id)
        }
        refresh()
      },
    })
  }

  const handleClearAll = () => {
    setConfirmAction({
      title: "Clear All Squares?",
      description: "This will unclaim every square on the board. Continue?",
      confirmLabel: "Clear All",
      variant: "destructive",
      onConfirm: () => {
        const state = getSquaresState()
        for (const sq of state.board) {
          sq.ownerId = null
        }
        saveSquaresState(state)
        refresh()
      },
    })
  }

  const handleLock = () => {
    setConfirmAction({
      title: "Lock Board?",
      description: "Locking prevents all players from claiming or unclaiming. Lock the board?",
      confirmLabel: "Lock",
      variant: "default",
      onConfirm: () => { lockBoard(); refresh() },
    })
  }

  const handleUnlock = () => {
    setConfirmAction({
      title: "Unlock Board?",
      description: "Unlocking will allow players to modify claims again. Are you sure?",
      confirmLabel: "Unlock",
      variant: "destructive",
      onConfirm: () => { unlockBoard(); refresh() },
    })
  }

  const handleAdminClearSquare = (row: number, col: number) => {
    const sq = sqState.board.find((s) => s.row === row && s.col === col)
    if (!sq || !sq.ownerId) return
    const owner = sqState.players.find((p) => p.id === sq.ownerId)
    setConfirmAction({
      title: "Clear this square?",
      description: `Clear the square owned by ${owner?.name ?? "unknown"}?`,
      confirmLabel: "Clear",
      variant: "destructive",
      onConfirm: () => { adminClearSquare(row, col); refresh() },
    })
  }

  const handleClearAllForPlayer = (id: string, name: string) => {
    setConfirmAction({
      title: `Clear all of ${name}'s squares?`,
      description: `This will unclaim all squares owned by ${name}.`,
      confirmLabel: "Clear All",
      variant: "destructive",
      onConfirm: () => {
        const state = getSquaresState()
        for (const sq of state.board) {
          if (sq.ownerId === id) sq.ownerId = null
        }
        saveSquaresState(state)
        refresh()
      },
    })
  }

  // --- Section C: Numbers ---
  const handleRandomize = () => {
    setConfirmAction({
      title: "Randomize Numbers?",
      description: "This will randomly assign digits 0–9 to rows and columns. Continue?",
      confirmLabel: "Randomize",
      variant: "default",
      onConfirm: () => { randomizeNumbers(); refresh() },
    })
  }

  const handleReRandomize = () => {
    setConfirmAction({
      title: "Re-randomize Numbers?",
      description: "This will reassign all row and column numbers. Any recorded winners will be cleared. Continue?",
      confirmLabel: "Re-randomize",
      variant: "destructive",
      onConfirm: () => {
        const state = getSquaresState()
        state.winners = []
        saveSquaresState(state)
        randomizeNumbers()
        refresh()
      },
    })
  }

  // --- Section D: Scoring ---
  const getScore = (cp: string) => scores[cp] ?? { patriots: "", seahawks: "" }

  const handleComputeWinner = (cp: "Q1" | "Q2" | "Q3" | "Final") => {
    const s = getScore(cp)
    const pScore = parseInt(s.patriots)
    const sScore = parseInt(s.seahawks)
    if (isNaN(pScore) || isNaN(sScore)) return
    const result = computeWinner(cp, pScore, sScore)
    if (!result) return
    setComputedResult(result)
    setConfirmingCheckpoint(cp)
  }

  const handleRecordWinner = () => {
    if (!computedResult || !confirmingCheckpoint) return
    const s = getScore(confirmingCheckpoint)
    recordWinner(
      computedResult.checkpoint,
      parseInt(s.patriots),
      parseInt(s.seahawks)
    )
    setComputedResult(null)
    setConfirmingCheckpoint(null)
    refresh()
  }

  const handleClearWinner = (cp: "Q1" | "Q2" | "Q3" | "Final") => {
    setConfirmAction({
      title: `Clear ${cp} winner?`,
      description: `Remove the recorded winner for ${cp}?`,
      confirmLabel: "Clear",
      variant: "destructive",
      onConfirm: () => { clearWinner(cp); refresh() },
    })
  }

  // --- Section E: Settings ---
  const handleFlip = () => {
    if (sqState.winners.length > 0) {
      setConfirmAction({
        title: "Flip Orientation?",
        description: "Flipping doesn't retroactively change past winners. Continue?",
        confirmLabel: "Flip",
        variant: "default",
        onConfirm: () => { flipOrientation(); refresh() },
      })
    } else {
      flipOrientation()
      refresh()
    }
  }

  const handleExportBoardCSV = () => {
    const header = ["", ...(sqState.colNumbers ?? Array(10).fill("?")).map(String)]
    const rows = Array.from({ length: 10 }).map((_, r) => {
      const rowNum = sqState.rowNumbers ? String(sqState.rowNumbers[r]) : "?"
      const cells = Array.from({ length: 10 }).map((_, c) => {
        const sq = sqState.board.find((s) => s.row === r && s.col === c)
        if (!sq?.ownerId) return ""
        const p = sqState.players.find((pl) => pl.id === sq.ownerId)
        return p?.name ?? ""
      })
      return [rowNum, ...cells]
    })
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "squares-board.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportWinnersCSV = () => {
    const header = ["Checkpoint", "Patriots Score", "Seahawks Score", "Patriots Digit", "Seahawks Digit", "Winner Name", "Timestamp", "Payout"]
    const rows = sqState.winners.map((w) => [
      w.checkpoint,
      String(w.patriotsScore),
      String(w.seahawksScore),
      String(w.patriotsDigit),
      String(w.seahawksDigit),
      w.winningPlayerName ?? "Unclaimed",
      w.timestamp,
      w.payoutAmount != null ? String(w.payoutAmount) : "",
    ])
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "squares-winners.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleBackup = () => {
    const json = exportSquaresBackup()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "super-bowl-full-backup.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const json = reader.result as string
      setConfirmAction({
        title: "Restore backup?",
        description: "This will overwrite all Props AND Squares data. Continue?",
        confirmLabel: "Restore",
        variant: "destructive",
        onConfirm: () => {
          importSquaresBackup(json)
          refresh()
        },
      })
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Extra squares helpers
  const extraPlayersNeedingPlacement = sqState.extraSquaresAssigned
    ? sqState.extraPlayerIds.filter((id) => {
        const claimed = getPlayerClaimedCount(sqState, id)
        return claimed < getBaseLimit(playerCount) + 1
      })
    : []

  const numbersReady = sqState.colNumbers !== null && sqState.rowNumbers !== null

  return (
    <div className="sq-admin">
      <Tabs defaultValue="players" className="admin-tabs">
        <TabsList className="admin-tabs-list">
          <TabsTrigger value="players" className="admin-tab-trigger">Players</TabsTrigger>
          <TabsTrigger value="board" className="admin-tab-trigger">Board</TabsTrigger>
          <TabsTrigger value="numbers" className="admin-tab-trigger">Numbers</TabsTrigger>
          <TabsTrigger value="scoring" className="admin-tab-trigger">Scoring</TabsTrigger>
          <TabsTrigger value="settings" className="admin-tab-trigger">Settings</TabsTrigger>
        </TabsList>

        {/* Section A: Players */}
        <TabsContent value="players">
          {/* Import from Props */}
          {sqState.players.length === 0 && (
            <div className="sq-admin-section">
              <Button className="sq-admin-action-btn" onClick={handleInitFromProps}>
                Import Players from Props
              </Button>
            </div>
          )}

          {/* Add player */}
          <div className="admin-add-form">
            <Input
              className="admin-add-input"
              placeholder="Player name..."
              value={newPlayerName}
              onChange={(e) => { setNewPlayerName(e.target.value); setAddPlayerError("") }}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddPlayer() }}
            />
            <Button className="admin-add-btn" onClick={handleAddPlayer}>Add</Button>
          </div>
          {addPlayerError && <p className="admin-add-error">{addPlayerError}</p>}

          {/* Player list */}
          <div className="admin-friend-list">
            {sqState.players.map((player) => {
              const claimed = getPlayerClaimedCount(sqState, player.id)
              const isExtra = sqState.extraPlayerIds.includes(player.id)
              return (
                <div key={player.id} className="admin-friend-row">
                  <div className="admin-friend-info">
                    <div
                      className="sq-admin-color-swatch"
                      style={{ backgroundColor: player.color }}
                    />
                    <span className="admin-friend-name">{player.name}</span>
                    <span className="sq-admin-claimed-count">{claimed} squares</span>
                    {isExtra && <span className="sq-admin-extra-badge">+1</span>}
                  </div>
                  <div className="admin-friend-actions">
                    <input
                      type="color"
                      className="sq-admin-color-input"
                      value={player.color}
                      onChange={(e) => { updatePlayerColor(player.id, e.target.value); refresh() }}
                    />
                    <Button
                      variant="outline"
                      className="admin-action-btn"
                      onClick={() => { setRenameId(player.id); setRenameValue(player.name) }}
                    >
                      Rename
                    </Button>
                    <Button
                      variant="destructive"
                      className="admin-action-btn"
                      onClick={() => handleRemovePlayer(player.id, player.name)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Rename dialog inline */}
          {renameId && (
            <div className="sq-admin-inline-dialog">
              <Input
                className="admin-add-input"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleRenameSubmit() }}
              />
              <Button className="admin-add-btn" onClick={handleRenameSubmit}>Save</Button>
              <Button variant="outline" className="admin-action-btn" onClick={() => setRenameId(null)}>Cancel</Button>
            </div>
          )}
        </TabsContent>

        {/* Section B: Board Management */}
        <TabsContent value="board">
          <div className="sq-admin-section">
            <div className="sq-admin-stats">
              <span>Total claimed: {totalClaimed} / 100</span>
              <span>Base limit: {baseLimit} per player</span>
              <span>Remainder: {remainder} extra squares</span>
              <span>Status: {sqState.locked ? "Locked" : "Open"}</span>
            </div>
          </div>

          {/* Assign extras */}
          {canAssignExtras(sqState) && (
            <div className="sq-admin-section">
              <Button className="sq-admin-action-btn" onClick={handleAssignExtras}>
                Assign Extra Squares
              </Button>
            </div>
          )}

          {/* Place extras */}
          {extraPlayersNeedingPlacement.length > 0 && (
            <div className="sq-admin-section">
              <h4 className="admin-section-title">Place Extra Squares</h4>
              <div className="sq-admin-extras-list">
                {extraPlayersNeedingPlacement.map((id) => {
                  const p = sqState.players.find((pl) => pl.id === id)
                  if (!p) return null
                  return (
                    <Button
                      key={id}
                      variant={placingForId === id ? "default" : "outline"}
                      className="admin-action-btn"
                      onClick={() => setPlacingForId(placingForId === id ? null : id)}
                    >
                      Place for {p.name}
                    </Button>
                  )
                })}
              </div>
              {placingForId && (
                <div className="sq-admin-place-grid">
                  <p className="sq-admin-place-hint">Tap an unclaimed square to assign it.</p>
                  <SquaresGrid state={sqState} interactive onCellClick={handlePlaceExtra} />
                </div>
              )}
            </div>
          )}

          {/* Auto-fill */}
          <div className="sq-admin-section">
            <div className="sq-admin-section-header">
              <h4 className="admin-section-title">Auto-Fill</h4>
              <Button className="sq-admin-action-btn" onClick={handleAutoFillAll}>
                Auto-Fill All
              </Button>
            </div>
            <div className="sq-admin-autofill-list">
              {sqState.players.map((p) => {
                const claimed = getPlayerClaimedCount(sqState, p.id)
                const limit = getPlayerLimit(sqState, p.id)
                const remaining = limit - claimed
                if (remaining <= 0) return null
                return (
                  <Button
                    key={p.id}
                    variant="outline"
                    className="admin-action-btn"
                    onClick={() => handleAutoFill(p.id, p.name)}
                  >
                    Auto-Fill {p.name} ({remaining})
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Lock / Unlock */}
          <div className="sq-admin-section">
            {!sqState.locked ? (
              <Button className="sq-admin-action-btn" onClick={handleLock}>Lock Board</Button>
            ) : (
              <Button variant="destructive" className="sq-admin-action-btn" onClick={handleUnlock}>Unlock Board</Button>
            )}
          </div>

          {/* Admin clear squares */}
          <div className="sq-admin-section">
            <div className="sq-admin-section-header">
              <h4 className="admin-section-title">Clear Squares</h4>
              <Button variant="destructive" className="sq-admin-action-btn" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>
            <div className="sq-admin-autofill-list">
              {sqState.players.map((p) => {
                const claimed = getPlayerClaimedCount(sqState, p.id)
                if (claimed === 0) return null
                return (
                  <Button
                    key={p.id}
                    variant="outline"
                    className="admin-action-btn"
                    onClick={() => handleClearAllForPlayer(p.id, p.name)}
                  >
                    Clear {p.name} ({claimed})
                  </Button>
                )
              })}
            </div>
            <div className="sq-admin-place-grid">
              <p className="sq-admin-place-hint">Or tap a square on the grid to clear it.</p>
              <SquaresGrid state={sqState} interactive onCellClick={handleAdminClearSquare} />
            </div>
          </div>
        </TabsContent>

        {/* Section C: Numbers */}
        <TabsContent value="numbers">
          <div className="sq-admin-section">
            {!numbersReady ? (
              <>
                <Button
                  className="sq-admin-action-btn"
                  onClick={handleRandomize}
                  disabled={!canRandomize(sqState)}
                >
                  Randomize Numbers
                </Button>
                {!canRandomize(sqState) && (
                  <p className="sq-admin-hint">Board must be locked with all 100 squares claimed.</p>
                )}
              </>
            ) : (
              <>
                <div className="sq-admin-numbers-display">
                  <div>
                    <strong>Columns:</strong> {sqState.colNumbers?.join(", ")}
                  </div>
                  <div>
                    <strong>Rows:</strong> {sqState.rowNumbers?.join(", ")}
                  </div>
                </div>
                <Button variant="destructive" className="sq-admin-action-btn" onClick={handleReRandomize}>
                  Re-randomize Numbers
                </Button>
              </>
            )}
          </div>
        </TabsContent>

        {/* Section D: Scoring */}
        <TabsContent value="scoring">
          {!numbersReady && (
            <p className="sq-admin-hint">Randomize numbers before scoring.</p>
          )}
          {numbersReady && (
            <div className="sq-admin-scoring">
              {CHECKPOINTS.map((cp) => {
                const existing = sqState.winners.find((w) => w.checkpoint === cp)
                const s = getScore(cp)
                return (
                  <div key={cp} className="sq-admin-score-row">
                    <span className="sq-admin-score-label">{cp}</span>
                    {existing ? (
                      <div className="sq-admin-score-result">
                        <span>Patriots {existing.patriotsScore} – Seahawks {existing.seahawksScore}</span>
                        <span className="sq-admin-score-winner">Winner: {existing.winningPlayerName}</span>
                        <Button variant="outline" className="admin-action-btn" onClick={() => handleClearWinner(cp)}>
                          Clear
                        </Button>
                      </div>
                    ) : (
                      <div className="sq-admin-score-inputs">
                        <Input
                          className="sq-admin-score-input"
                          type="number"
                          placeholder="PAT"
                          value={s.patriots}
                          onChange={(e) => setScores({ ...scores, [cp]: { ...s, patriots: e.target.value } })}
                        />
                        <Input
                          className="sq-admin-score-input"
                          type="number"
                          placeholder="SEA"
                          value={s.seahawks}
                          onChange={(e) => setScores({ ...scores, [cp]: { ...s, seahawks: e.target.value } })}
                        />
                        <Button className="admin-action-btn" onClick={() => handleComputeWinner(cp)}>
                          Compute
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Winners list */}
          {sqState.winners.length > 0 && (
            <div className="sq-admin-section">
              <h4 className="admin-section-title">Recorded Winners</h4>
              {sqState.winners.map((w) => (
                <div key={w.checkpoint} className="sq-admin-winner-row">
                  <span className="sq-admin-score-label">{w.checkpoint}</span>
                  <span>{w.winningPlayerName} — Patriots {w.patriotsScore}, Seahawks {w.seahawksScore}</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Section E: Settings */}
        <TabsContent value="settings">
          <div className="sq-admin-section">
            <h4 className="admin-section-title">Orientation</h4>
            <p className="sq-admin-hint">
              Currently: {sqState.orientation === "patriots-cols" ? "Patriots on columns, Seahawks on rows" : "Seahawks on columns, Patriots on rows"}
            </p>
            <Button variant="outline" className="sq-admin-action-btn" onClick={handleFlip}>
              Flip Grid Orientation
            </Button>
          </div>

          <div className="sq-admin-section">
            <h4 className="admin-section-title">CSV Exports</h4>
            <div className="admin-backup-row">
              <Button variant="outline" className="admin-action-btn" onClick={handleExportBoardCSV}>
                Export Board CSV
              </Button>
              <Button variant="outline" className="admin-action-btn" onClick={handleExportWinnersCSV}>
                Export Winners CSV
              </Button>
            </div>
          </div>

          <div className="sq-admin-section">
            <h4 className="admin-section-title">Backup &amp; Restore</h4>
            <div className="admin-backup-row">
              <Button variant="outline" className="admin-action-btn" onClick={handleBackup}>
                Download Full Backup
              </Button>
              <Button variant="outline" className="admin-action-btn" onClick={() => fileInputRef.current?.click()}>
                Restore Backup
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="admin-file-input"
                onChange={handleRestore}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Computed winner confirmation */}
      <ConfirmDialog
        open={computedResult !== null && confirmingCheckpoint !== null}
        onOpenChange={(open) => {
          if (!open) {
            setComputedResult(null)
            setConfirmingCheckpoint(null)
          }
        }}
        title={
          computedResult?.unclaimed
            ? `${confirmingCheckpoint} — Unclaimed Square`
            : `Record ${confirmingCheckpoint} Winner?`
        }
        description={
          computedResult?.unclaimed
            ? `The winning square [${computedResult.row},${computedResult.col}] is unclaimed. Cannot record a winner for this checkpoint.`
            : computedResult
              ? `Winner: ${computedResult.playerName} (Patriots ${computedResult.patriotsDigit}, Seahawks ${computedResult.seahawksDigit} → Square [${computedResult.row},${computedResult.col}]). Record ${computedResult.playerName} as the ${confirmingCheckpoint} winner?`
              : ""
        }
        confirmLabel={computedResult?.unclaimed ? "OK" : "Record"}
        variant="default"
        onConfirm={() => {
          if (computedResult?.unclaimed) {
            setComputedResult(null)
            setConfirmingCheckpoint(null)
          } else {
            handleRecordWinner()
          }
        }}
      />

      {/* General confirm dialog */}
      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={(open) => { if (!open) setConfirmAction(null) }}
        title={confirmAction?.title ?? ""}
        description={confirmAction?.description ?? ""}
        confirmLabel={confirmAction?.confirmLabel ?? "Confirm"}
        variant={confirmAction?.variant ?? "default"}
        onConfirm={() => confirmAction?.onConfirm()}
      />
    </div>
  )
}
