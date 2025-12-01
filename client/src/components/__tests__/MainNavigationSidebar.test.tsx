import React from 'react'
import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/router'
import MainNavigationSidebar from '../MainNavigationSidebar'

// Mock next/router
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    push: mockPush,
  }),
}))

// Mock the AuthContext
const mockLogout = jest.fn()
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}))

describe('MainNavigationSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the navigation sidebar with correct menu items', () => {
    render(
      <MainNavigationSidebar mobileOpen={false} handleDrawerToggle={() => {}} />
    )

    // Check if the main menu items are rendered (appears twice due to mobile/desktop drawers)
    expect(screen.getAllByText('Dashboard')).toHaveLength(2)
    expect(screen.getAllByText('Post Management')).toHaveLength(2)
    expect(screen.getAllByText('Event Registration')).toHaveLength(2)
    expect(screen.getAllByText('Community')).toHaveLength(2)
  })

  it('renders the bottom menu items', () => {
    render(
      <MainNavigationSidebar mobileOpen={false} handleDrawerToggle={() => {}} />
    )

    expect(screen.getAllByText('Settings')).toHaveLength(2)
    expect(screen.getAllByText('Logout')).toHaveLength(2)
  })

  it('displays the Community Portal title', () => {
    render(
      <MainNavigationSidebar mobileOpen={false} handleDrawerToggle={() => {}} />
    )

    expect(screen.getAllByText('Community Portal')).toHaveLength(2)
  })
})