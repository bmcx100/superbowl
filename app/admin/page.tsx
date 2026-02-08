"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
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
} from "@/lib/store"
import type { AppState, Friend } from "@/lib/types"

export default function AdminPage() {
  const router = useRouter()
  const [appState, setAppState] = useState<AppState | null>(null)
  const [newName, setNewName] = useState("")
  const [addError, setAddError] = useState("")

  // Rename dialog state
  const [renameTarget, setRenameTarget] = useState<Friend | null>(null)
  const [renameName, setRenameName] = useState("")

  // Confirm dialog state
  const [confirmAction, setConfirmAction] = useState<{
    title: string
    description: string
    confirmLabel: string
    onConfirm: () => void
    variant: "default" | "destructive"
  } | null>(null)

  useEffect(() => {
    setAppState(getState())
  }, [])

  const refresh = () => setAppState(getState())

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

  if (!appState) return null

  const statusLabel = (friend: Friend) => {
    const s = getStatus(friend)
    if (s === "complete") return "Complete"
    if (s === "in-progress") return `${getPickCount(friend)} / ${appState.props.length}`
    return "Not Started"
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <button className="admin-back" onClick={() => router.push("/")}>
          <ArrowLeft size={28} />
          <span>Home</span>
        </button>
        <h1 className="admin-title">Admin Panel</h1>
      </div>

      <Tabs defaultValue="friends" className="admin-tabs">
        <TabsList className="admin-tabs-list">
          <TabsTrigger value="friends" className="admin-tab-trigger">
            Friends
          </TabsTrigger>
          <TabsTrigger value="props" className="admin-tab-trigger">
            Props
          </TabsTrigger>
          <TabsTrigger value="scoring" className="admin-tab-trigger">
            Scoring
          </TabsTrigger>
          <TabsTrigger value="settings" className="admin-tab-trigger">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
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
            <Button className="admin-add-btn" onClick={handleAddFriend}>
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
                    className="admin-action-btn"
                    onClick={() => {
                      setRenameTarget(friend)
                      setRenameName(friend.name)
                    }}
                  >
                    Rename
                  </Button>
                  <Button
                    variant="outline"
                    className="admin-action-btn"
                    onClick={() => handleResetPicks(friend)}
                  >
                    Reset Picks
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

        <TabsContent value="props">
          <p className="admin-placeholder">Props management coming soon.</p>
        </TabsContent>

        <TabsContent value="scoring">
          <p className="admin-placeholder">Scoring panel coming soon.</p>
        </TabsContent>

        <TabsContent value="settings">
          <p className="admin-placeholder">Settings coming soon.</p>
        </TabsContent>
      </Tabs>

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
    </div>
  )
}
