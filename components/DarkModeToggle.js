'use client'
import { useState, useEffect } from 'react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // 讀取 localStorage 設定
    const saved = localStorage.getItem('dark_mode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved !== null ? saved === 'true' : prefersDark
    setDark(isDark)
    if (isDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem('dark_mode', String(next))
    if (next) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  // 避免 SSR 閃爍
  if (!mounted) return <div style={{ width: 44, height: 24 }} />

  return (
    <button
      onClick={toggle}
      title={dark ? '切換為白天模式' : '切換為夜間模式'}
      style={{
        position: 'relative',
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        background: dark ? '#3b82f6' : 'rgba(255,255,255,0.2)',
        transition: 'background 0.25s',
        flexShrink: 0,
        padding: 0,
      }}>
      {/* 滑塊 */}
      <span style={{
        position: 'absolute',
        top: '3px',
        left: dark ? '23px' : '3px',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: 'white',
        transition: 'left 0.25s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        lineHeight: 1,
      }}>
        {dark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
