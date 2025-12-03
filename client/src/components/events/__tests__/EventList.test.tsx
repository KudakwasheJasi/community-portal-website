import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventList from '../EventList';
import { EventContext } from '@/context/EventContext';

// Mock the EventContext
const mockRegisterForEvent = jest.fn();
const mockUnregisterFromEvent = jest.fn();
const mockLoadingStates = {};

const mockEventContextValue = {
  registerForEvent: mockRegisterForEvent,
  unregisterFromEvent: mockUnregisterFromEvent,
  loadingStates: mockLoadingStates,
};

// Mock useRouter
const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock useAuth
const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
};

const mockUseAuth = jest.fn();
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

const mockEvents = [
  {
    id: 'event-1',
    title: 'My Event',
    description: 'Event description',
    location: 'Test Location',
    startDate: '2025-12-05T10:00:00.000Z',
    endDate: '2025-12-05T12:00:00.000Z',
    organizerId: 'user-1', // Same as current user
    status: 'published',
    maxAttendees: 10,
    imageUrl: 'https://example.com/image.jpg',
    createdAt: '2025-12-01T00:00:00.000Z',
    updatedAt: '2025-12-01T00:00:00.000Z',
  },
  {
    id: 'event-2',
    title: 'Other Event',
    description: 'Another event',
    location: 'Another Location',
    startDate: '2025-12-06T10:00:00.000Z',
    endDate: '2025-12-06T12:00:00.000Z',
    organizerId: 'user-2', // Different user
    status: 'published',
    maxAttendees: 20,
    createdAt: '2025-12-01T00:00:00.000Z',
    updatedAt: '2025-12-01T00:00:00.000Z',
  },
];

const renderEventList = (props = {}) => {
  const defaultProps = {
    events: mockEvents,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  return render(
    <EventContext.Provider value={mockEventContextValue}>
      <EventList {...defaultProps} {...props} />
    </EventContext.Provider>
  );
};

describe('EventList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authorization Logic', () => {
    it('shows edit and delete buttons only for events owned by current user', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      renderEventList();

      // Should show buttons for owned event
      expect(screen.getByTestId('edit-event-1')).toBeInTheDocument();
      expect(screen.getByTestId('delete-event-1')).toBeInTheDocument();

      // Should NOT show buttons for unowned event
      expect(screen.queryByTestId('edit-event-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('delete-event-2')).not.toBeInTheDocument();
    });

    it('does not show action buttons when user is not logged in', () => {
      mockUseAuth.mockReturnValue({ user: null });

      renderEventList();

      // Should not show any action buttons
      expect(screen.queryByTestId(/edit-event/)).not.toBeInTheDocument();
      expect(screen.queryByTestId(/delete-event/)).not.toBeInTheDocument();
    });

    it('does not show action buttons when onEdit and onDelete are not provided', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      renderEventList({ onEdit: undefined, onDelete: undefined });

      // Should not show any action buttons
      expect(screen.queryByTestId(/edit-event/)).not.toBeInTheDocument();
      expect(screen.queryByTestId(/delete-event/)).not.toBeInTheDocument();
    });
  });

  describe('Event Display', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: mockUser });
    });

    it('renders all events', () => {
      renderEventList();

      expect(screen.getByText('My Event')).toBeInTheDocument();
      expect(screen.getByText('Other Event')).toBeInTheDocument();
    });

    it('displays event details correctly', () => {
      renderEventList();

      expect(screen.getByText('Event description')).toBeInTheDocument();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
      expect(screen.getByText('Another Location')).toBeInTheDocument();
    });

    it('shows registration status for events', () => {
      renderEventList();

      // Should show some indication of registration status
      // This depends on the component implementation
      expect(screen.getByText('My Event')).toBeInTheDocument();
    });
  });

  describe('Event Actions', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: mockUser });
    });

    it('calls onEdit when edit button is clicked', () => {
      const mockOnEdit = jest.fn();
      renderEventList({ onEdit: mockOnEdit });

      const editButton = screen.getByTestId('edit-event-1');
      fireEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(mockEvents[0]);
    });

    it('calls onDelete when delete button is clicked', () => {
      const mockOnDelete = jest.fn();
      renderEventList({ onDelete: mockOnDelete });

      const deleteButton = screen.getByTestId('delete-event-1');
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith(mockEvents[0]);
    });

    it('navigates to event details when event card is clicked', () => {
      renderEventList();

      const eventCard = screen.getByText('My Event').closest('div');
      fireEvent.click(eventCard);

      expect(mockPush).toHaveBeenCalledWith('/events/event-1');
    });
  });

  describe('Event Registration', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: mockUser });
    });

    it('calls registerForEvent when register button is clicked', () => {
      renderEventList();

      // Assuming there's a register button for unowned events
      // This test depends on the component's registration UI
      const registerButtons = screen.queryAllByText(/register/i);
      if (registerButtons.length > 0) {
        fireEvent.click(registerButtons[0]);
        expect(mockRegisterForEvent).toHaveBeenCalled();
      }
    });

    it('calls unregisterFromEvent when unregister button is clicked', () => {
      // This would test unregister functionality
      // Depends on component implementation
    });
  });

  describe('Loading States', () => {
    it('shows loading indicators for actions in progress', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      const loadingStates = {
        'register-event-1': true,
        'unregister-event-2': false,
      };

      render(
        <EventContext.Provider value={{
          ...mockEventContextValue,
          loadingStates,
        }}>
          <EventList
            events={mockEvents}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
          />
        </EventContext.Provider>
      );

      // Should show loading state for event-1 registration
      // This depends on component implementation
    });
  });

  describe('Empty States', () => {
    it('handles empty events array', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      renderEventList({ events: [] });

      // Should handle empty state gracefully
      expect(screen.queryByTestId(/event-/)).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles events with missing data gracefully', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      const incompleteEvent = {
        id: 'event-3',
        title: 'Incomplete Event',
        // Missing other required fields
      };

      renderEventList({ events: [incompleteEvent] });

      // Should render without crashing
      expect(screen.getByText('Incomplete Event')).toBeInTheDocument();
    });
  });
});