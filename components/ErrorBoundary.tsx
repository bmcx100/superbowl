"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { importBackup } from "@/lib/store"

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  fileInputRef: React.RefObject<HTMLInputElement | null>

  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
    this.fileInputRef = React.createRef()
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importBackup(reader.result as string)
        this.setState({ hasError: false })
      } catch {
        alert("Invalid backup file.")
      }
    }
    reader.readAsText(file)
  }

  handleClear = () => {
    localStorage.removeItem("sbProps")
    this.setState({ hasError: false })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1 className="error-boundary-title">Something went wrong</h1>
          <p className="error-boundary-desc">
            The app encountered an error. You can try restoring from a backup or
            resetting the app data.
          </p>
          <div className="error-boundary-actions">
            <Button
              variant="outline"
              className="admin-action-btn"
              onClick={() => this.fileInputRef.current?.click()}
            >
              Restore from Backup
            </Button>
            <Button
              variant="destructive"
              className="admin-action-btn"
              onClick={this.handleClear}
            >
              Reset App Data
            </Button>
            <input
              ref={this.fileInputRef}
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={this.handleRestore}
            />
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
