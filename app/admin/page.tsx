"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronUp, ChevronDown, Lock, LockOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import {
  getState,
  addFriend,
  renameFriend,
  deleteFriend,
  resetFriendPicks,
  randomizePicks,
  updateProp,
  reorderProps,
  getLeaderboard,
  saveState,
  lockProps,
  unlockProps,
  areAllFriendsComplete,
  clearAllPicks,
  clearAllResults,
  clearAllFriends,
  clearAllProps,
  setCorrectAnswer,
} from "@/lib/store"
import { exportSquaresBackup, importSquaresBackup } from "@/lib/squaresStore"
import { SquaresAdmin } from "@/components/squares/SquaresAdmin"
import { Leaderboard } from "@/components/Leaderboard"
import type { AppState, Friend, Prop } from "@/lib/types"

export default function AdminPage() {
  const router = useRouter()
  const [appState, setAppState] = useState<AppState | null>(null)
  const [leaderboard, setLeaderboard] = useState(() => getLeaderboard())
  const [newName, setNewName] = useState("")
  const [addError, setAddError] = useState("")

  // Rename dialog state
  const [renameTarget, setRenameTarget] = useState<Friend | null>(null)
  const [renameName, setRenameName] = useState("")

  const [eventName, setEventName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Edit prop dialog state
  const [editProp, setEditProp] = useState<Prop | null>(null)
  const [editQuestion, setEditQuestion] = useState("")
  const [editOptionA, setEditOptionA] = useState("")
  const [editOptionB, setEditOptionB] = useState("")

  // Confirm dialog state
  const [confirmAction, setConfirmAction] = useState<{
    title: string
    description: string
    confirmLabel: string
    onConfirm: () => void
    variant: "default" | "destructive"
  } | null>(null)

  const [lockedNotice, setLockedNotice] = useState(false)
  const showLockedNotice = () => {
    setLockedNotice(true)
  }

  useEffect(() => {
    const s = getState()
    setAppState(s)
    setEventName(s.eventName)
    setLeaderboard(getLeaderboard())
  }, [])

  const refresh = () => {
    setAppState(getState())
    setLeaderboard(getLeaderboard())
  }

  const getPickCount = (friend: Friend) => Object.keys(friend.picks).length

  const getStatus = (friend: Friend): "complete" | "in-progress" | "not-started" => {
    if (!appState) return "not-started"
    const count = getPickCount(friend)
    if (count >= appState.props.length && appState.props.length > 0) return "complete"
    if (count > 0) return "in-progress"
    return "not-started"
  }

  const handleAddFriend = () => {
    if (!appState) return
    const trimmed = newName.trim()
    if (!trimmed) {
      setAddError("Name cannot be empty")
      return
    }
    const duplicate = appState.friends.some(
      (f) => f.name.toLowerCase() === trimmed.toLowerCase()
    )
    if (duplicate) {
      setAddError("A friend with that name already exists")
      return
    }
    addFriend(trimmed)
    setNewName("")
    setAddError("")
    refresh()
  }

  const handleRenameSubmit = () => {
    if (!renameTarget || !appState) return
    const trimmed = renameName.trim()
    if (!trimmed) return
    const duplicate = appState.friends.some(
      (f) => f.id !== renameTarget.id && f.name.toLowerCase() === trimmed.toLowerCase()
    )
    if (duplicate) return
    renameFriend(renameTarget.id, trimmed)
    setRenameTarget(null)
    setRenameName("")
    refresh()
  }

  const handleResetPicks = (friend: Friend) => {
    setConfirmAction({
      title: `Reset ${friend.name}'s picks?`,
      description: `This will erase all of ${friend.name}'s picks. This cannot be undone.`,
      confirmLabel: "Reset Picks",
      variant: "destructive",
      onConfirm: () => {
        resetFriendPicks(friend.id)
        refresh()
      },
    })
  }

  const handleDelete = (friend: Friend) => {
    setConfirmAction({
      title: `Delete ${friend.name}?`,
      description: `This will permanently remove ${friend.name} and all their picks. This cannot be undone.`,
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: () => {
        deleteFriend(friend.id)
        refresh()
      },
    })
  }

  const sortedProps = appState
    ? [...appState.props].sort((a, b) => a.order - b.order)
    : []

  const openEditProp = (prop: Prop) => {
    setEditProp(prop)
    setEditQuestion(prop.question)
    setEditOptionA(prop.optionA)
    setEditOptionB(prop.optionB)
  }

  const handleEditPropSubmit = () => {
    if (!editProp) return
    updateProp(editProp.id, editQuestion.trim(), editOptionA.trim(), editOptionB.trim())
    setEditProp(null)
    refresh()
  }

  const handleMoveProp = (index: number, direction: "up" | "down") => {
    const ids = sortedProps.map((p) => p.id)
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= ids.length) return
    const temp = ids[index]
    ids[index] = ids[targetIndex]
    ids[targetIndex] = temp
    reorderProps(ids)
    refresh()
  }

  const handleEventNameSave = () => {
    if (!appState) return
    const updated = { ...appState, eventName: eventName.trim() || appState.eventName }
    saveState(updated)
    refresh()
  }

  const handleDownloadBackup = () => {
    const json = exportSquaresBackup()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "super-bowl-full-backup.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          const s = getState()
          setAppState(s)
          setEventName(s.eventName)
          setLeaderboard(getLeaderboard())
        },
      })
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleExportPicksCSV = () => {
    if (!appState) return
    const props = [...appState.props].sort((a, b) => a.order - b.order)
    const friends = appState.friends
    const header = ["Question", "Option A", "Option B", "Correct Answer", ...friends.map((f) => f.name)]
    const rows = props.map((prop) => {
      const correct = prop.correctAnswer === "A" ? prop.optionA : prop.correctAnswer === "B" ? prop.optionB : ""
      const picks = friends.map((f) => {
        const pick = f.picks[prop.id]
        if (pick === "A") return prop.optionA
        if (pick === "B") return prop.optionB
        return ""
      })
      return [prop.question, prop.optionA, prop.optionB, correct, ...picks]
    })
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "picks-matrix.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportLeaderboardCSV = () => {
    const entries = getLeaderboard()
    const header = ["Name", "Correct", "Scored", "Accuracy"]
    const rows = entries.map((e) => [
      e.name,
      String(e.correct),
      String(e.scored),
      e.scored > 0 ? `${Math.round(e.accuracy * 100)}%` : "0%",
    ])
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "leaderboard.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleScore = (propId: string, value: "A" | "B" | null) => {
    setCorrectAnswer(propId, value)
    refresh()
  }

  const [adminMode, setAdminMode] = useState<"props" | "squares">("props")

  if (!appState) return null

  const statusLabel = (friend: Friend) => {
    const s = getStatus(friend)
    if (s === "complete") return "Complete"
    if (s === "in-progress") return `${getPickCount(friend)} / ${appState.props.length}`
    return "Not Started"
  }

  const isLocked = appState.propsLocked === true

  const lockBanner = (
    <div className="picks-complete-banner">
      {isLocked ? (
        <>
          <Lock size={20} />
          <span>Props are locked</span>
          <Button variant="outline" className="picks-action-btn picks-action-btn-secondary" onClick={() => { unlockProps(); refresh() }}>
            Unlock
          </Button>
        </>
      ) : (
        <>
          <LockOpen size={20} />
          <span>Props are unlocked</span>
          <Button className="picks-action-btn" onClick={() => {
            if (!areAllFriendsComplete()) {
              setConfirmAction({
                title: "Not everyone has picked",
                description: "Some friends haven't finished making their picks. Are you sure you want to lock?",
                confirmLabel: "Lock Anyway",
                variant: "default",
                onConfirm: () => { lockProps(); refresh() },
              })
            } else {
              lockProps()
              refresh()
            }
          }}>
            Lock Picks
          </Button>
        </>
      )}
    </div>
  )

  return (
    <div className="admin-page">
      <div className="admin-header">
        <button className="admin-back" onClick={() => router.push("/")}>
          <ArrowLeft size={28} />
          <span>Home</span>
        </button>
        <h1 className="admin-title">Admin Panel</h1>
      </div>

      <div className="admin-mode-toggle">
        <button
          className={`admin-mode-btn ${adminMode === "props" ? "admin-mode-active" : ""}`}
          onClick={() => setAdminMode("props")}
        >
          Props
        </button>
        <button
          className={`admin-mode-btn ${adminMode === "squares" ? "admin-mode-active" : ""}`}
          onClick={() => setAdminMode("squares")}
        >
          Squares
        </button>
      </div>

      {adminMode === "squares" && (
        <SquaresAdmin />
      )}

      {adminMode === "props" && (
      <Tabs defaultValue="scoring" className="admin-tabs">
        <TabsList className="admin-tabs-list">
          <TabsTrigger value="scoring" className="admin-tab-trigger">
            Scoring
          </TabsTrigger>
          <TabsTrigger value="configuration" className="admin-tab-trigger">
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scoring" className="admin-scoring-sheet">
          <div className="admin-scoring-list">
            {sortedProps.map((prop, i) => (
              <div key={prop.id} className="admin-scoring-row">
                <div className="admin-scoring-info">
                  <span className="admin-prop-order">{i + 1}</span>
                  <span className="admin-prop-question">{prop.question}</span>
                </div>
                <div className="admin-scoring-buttons">
                  <Button
                    variant={prop.correctAnswer === "A" ? "default" : "outline"}
                    className={`admin-score-btn ${prop.correctAnswer === "A" ? "admin-score-active" : ""}`}
                    onClick={() => handleScore(prop.id, prop.correctAnswer === "A" ? null : "A")}
                  >
                    {prop.optionA}
                  </Button>
                  <Button
                    variant={prop.correctAnswer === "B" ? "default" : "outline"}
                    className={`admin-score-btn ${prop.correctAnswer === "B" ? "admin-score-active" : ""}`}
                    onClick={() => handleScore(prop.id, prop.correctAnswer === "B" ? null : "B")}
                  >
                    {prop.optionB}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-scoring-leaderboard">
            <h3 className="admin-section-title">Live Leaderboard</h3>
            <Leaderboard entries={leaderboard} />
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="admin-folder-sheet">
          <Tabs defaultValue="friends" className="admin-sub-tabs">
            <TabsList className="admin-sub-tabs-list">
              <TabsTrigger value="friends" className="admin-tab-trigger" data-value="friends">
                Friends
              </TabsTrigger>
              <TabsTrigger value="props" className="admin-tab-trigger" data-value="props">
                Props
              </TabsTrigger>
              <TabsTrigger value="settings" className="admin-tab-trigger" data-value="settings">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="friends" className="admin-sub-sheet admin-sub-sheet-friends">
              {lockBanner}

              {/* Add friend form */}
              <div className="admin-add-form">
                <Input
                  className="admin-add-input"
                  placeholder="Friend's name..."
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value)
                    setAddError("")
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddFriend()
                  }}
                />
                <Button className={`admin-add-btn ${isLocked ? "admin-btn-locked" : ""}`} onClick={isLocked ? showLockedNotice : handleAddFriend}>
                  Add
                </Button>
              </div>
              {addError && <p className="admin-add-error">{addError}</p>}

              {/* Friend list */}
              <div className="admin-friend-list">
                {appState.friends.map((friend) => (
                  <div key={friend.id} className="admin-friend-row">
                    <div className="admin-friend-info">
                      <span className="admin-friend-name">{friend.name}</span>
                      <Badge className={`friend-badge friend-badge-${getStatus(friend)}`}>
                        {statusLabel(friend)}
                      </Badge>
                    </div>
                    <div className="admin-friend-actions">
                      <Button
                        variant="outline"
                        className={`admin-action-btn ${isLocked ? "admin-btn-locked" : ""}`}
                        onClick={isLocked ? showLockedNotice : () => setConfirmAction({
                          title: `Randomize ${friend.name}'s picks?`,
                          description: "This will replace all of their current picks with random selections.",
                          confirmLabel: "Randomize",
                          variant: "default",
                          onConfirm: () => { randomizePicks(friend.id); refresh() },
                        })}
                      >
                        Random Picks
                      </Button>
                      <Button
                        variant="outline"
                        className={`admin-action-btn ${isLocked ? "admin-btn-locked" : ""}`}
                        onClick={isLocked ? showLockedNotice : () => handleResetPicks(friend)}
                      >
                        Reset Picks
                      </Button>
                      <Button
                        variant="outline"
                        className="admin-action-btn"
                        onClick={() => {
                          setRenameTarget(friend)
                          setRenameName(friend.name)
                        }}
                      >
                        Rename
                      </Button>
                      <Button
                        variant="destructive"
                        className="admin-action-btn"
                        onClick={() => handleDelete(friend)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="props" className="admin-sub-sheet admin-sub-sheet-props">
              {lockBanner}

              <div className="admin-prop-list">
                {sortedProps.map((prop, i) => (
                  <div key={prop.id} className="admin-prop-row">
                    <div className="admin-prop-order">{i + 1}</div>
                    <div className="admin-prop-info">
                      <span className="admin-prop-question">{prop.question}</span>
                      <span className="admin-prop-options">
                        {prop.optionA} / {prop.optionB}
                      </span>
                    </div>
                    <div className="admin-prop-actions">
                      <Button
                        variant="outline"
                        className={`admin-action-btn ${isLocked ? "admin-btn-locked" : ""}`}
                        onClick={isLocked ? showLockedNotice : () => openEditProp(prop)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="admin-arrow-btn"
                        onClick={() => handleMoveProp(i, "up")}
                        disabled={i === 0}
                      >
                        <ChevronUp size={20} />
                      </Button>
                      <Button
                        variant="outline"
                        className="admin-arrow-btn"
                        onClick={() => handleMoveProp(i, "down")}
                        disabled={i === sortedProps.length - 1}
                      >
                        <ChevronDown size={20} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="admin-sub-sheet admin-sub-sheet-settings">
              {lockBanner}

              {/* Event name */}
              <div className="admin-settings-section">
                <h3 className="admin-section-title">Event Name</h3>
                <div className="admin-add-form">
                  <Input
                    className="admin-add-input"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEventNameSave()
                    }}
                  />
                  <Button className="admin-add-btn" onClick={handleEventNameSave}>
                    Save
                  </Button>
                </div>
              </div>

              {/* Reset controls */}
              <div className="admin-settings-section">
                <h3 className="admin-section-title">Reset Controls</h3>
                <div className="admin-reset-grid">
                  <Button
                    variant="destructive"
                    className={`admin-reset-btn ${isLocked ? "admin-btn-locked" : ""}`}
                    onClick={isLocked ? showLockedNotice : () => setConfirmAction({
                      title: "Clear all picks?",
                      description: "This will erase all friends' picks. Are you sure?",
                      confirmLabel: "Clear Picks",
                      variant: "destructive",
                      onConfirm: () => { clearAllPicks(); refresh() },
                    })}
                  >
                    Clear Picks
                  </Button>
                  <Button
                    variant="destructive"
                    className="admin-reset-btn"
                    onClick={() => setConfirmAction({
                      title: "Clear all results?",
                      description: "This will clear all correct answers. Are you sure?",
                      confirmLabel: "Clear Results",
                      variant: "destructive",
                      onConfirm: () => { clearAllResults(); refresh() },
                    })}
                  >
                    Clear Results
                  </Button>
                  <Button
                    variant="destructive"
                    className={`admin-reset-btn ${isLocked ? "admin-btn-locked" : ""}`}
                    onClick={isLocked ? showLockedNotice : () => setConfirmAction({
                      title: "Clear all friends?",
                      description: "This will remove all friends and their picks. Are you sure?",
                      confirmLabel: "Clear Friends",
                      variant: "destructive",
                      onConfirm: () => { clearAllFriends(); refresh() },
                    })}
                  >
                    Clear Friends
                  </Button>
                  <Button
                    variant="destructive"
                    className={`admin-reset-btn ${isLocked ? "admin-btn-locked" : ""}`}
                    onClick={isLocked ? showLockedNotice : () => setConfirmAction({
                      title: "Reset all props?",
                      description: "This will restore the default 25 props and clear all picks and results. Are you sure?",
                      confirmLabel: "Clear Props",
                      variant: "destructive",
                      onConfirm: () => { clearAllProps(); refresh() },
                    })}
                  >
                    Clear Props
                  </Button>
                </div>
              </div>

              {/* Backup & Restore */}
              <div className="admin-settings-section">
                <h3 className="admin-section-title">Backup &amp; Restore</h3>
                <div className="admin-backup-row">
                  <Button variant="outline" className="admin-action-btn" onClick={handleDownloadBackup}>
                    Download Backup
                  </Button>
                  <Button variant="outline" className="admin-action-btn" onClick={() => fileInputRef.current?.click()}>
                    Restore Backup
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="admin-file-input"
                    onChange={handleRestoreFile}
                  />
                </div>
              </div>

              {/* CSV Exports */}
              <div className="admin-settings-section">
                <h3 className="admin-section-title">CSV Exports</h3>
                <div className="admin-backup-row">
                  <Button variant="outline" className="admin-action-btn" onClick={handleExportPicksCSV}>
                    Export Picks Matrix
                  </Button>
                  <Button variant="outline" className="admin-action-btn" onClick={handleExportLeaderboardCSV}>
                    Export Leaderboard
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
      )}

      {/* Rename dialog */}
      <Dialog
        open={renameTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRenameTarget(null)
            setRenameName("")
          }
        }}
      >
        <DialogContent className="confirm-dialog">
          <DialogHeader>
            <DialogTitle className="confirm-dialog-title">Rename Friend</DialogTitle>
          </DialogHeader>
          <Input
            className="admin-add-input"
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameSubmit()
            }}
          />
          <DialogFooter>
            <Button
              variant="outline"
              className="confirm-dialog-cancel"
              onClick={() => {
                setRenameTarget(null)
                setRenameName("")
              }}
            >
              Cancel
            </Button>
            <Button className="confirm-dialog-confirm" onClick={handleRenameSubmit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit prop dialog */}
      <Dialog
        open={editProp !== null}
        onOpenChange={(open) => {
          if (!open) setEditProp(null)
        }}
      >
        <DialogContent className="confirm-dialog">
          <DialogHeader>
            <DialogTitle className="confirm-dialog-title">Edit Prop</DialogTitle>
            <DialogDescription className="admin-edit-warning">
              Editing this prop will clear all picks and results for it.
            </DialogDescription>
          </DialogHeader>
          <div className="admin-edit-fields">
            <Input
              className="admin-add-input"
              placeholder="Question"
              value={editQuestion}
              onChange={(e) => setEditQuestion(e.target.value)}
            />
            <Input
              className="admin-add-input"
              placeholder="Option A"
              value={editOptionA}
              onChange={(e) => setEditOptionA(e.target.value)}
            />
            <Input
              className="admin-add-input"
              placeholder="Option B"
              value={editOptionB}
              onChange={(e) => setEditOptionB(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="confirm-dialog-cancel"
              onClick={() => setEditProp(null)}
            >
              Cancel
            </Button>
            <Button className="confirm-dialog-confirm" onClick={handleEditPropSubmit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm dialog for destructive actions */}
      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null)
        }}
        title={confirmAction?.title ?? ""}
        description={confirmAction?.description ?? ""}
        confirmLabel={confirmAction?.confirmLabel ?? "Confirm"}
        variant={confirmAction?.variant ?? "default"}
        onConfirm={() => {
          confirmAction?.onConfirm()
        }}
      />

      <ConfirmDialog
        open={lockedNotice}
        onOpenChange={(open) => {
          if (!open) setLockedNotice(false)
        }}
        title="Props are locked"
        description="Unlock props in the Settings tab before making changes."
        confirmLabel="OK"
        onConfirm={() => setLockedNotice(false)}
      />
    </div>
  )
}
