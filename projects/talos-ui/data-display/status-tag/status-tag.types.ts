/**
 * Standard canonical workflow orchestration statuses.
 */
export type TalosCanonicalWorkflowStatus =
  | 'NEW'
  | 'PENDING'
  | 'IN-PROGRESS'
  | 'PAUSED'
  | 'RETRYING'
  | 'SKIPPED'
  | 'SUCCESS'
  | 'COMPLETED'
  | 'ERROR'
  | 'TERMINATED'
  | 'EXPIRED';

/**
 * Permissive workflow status input accepting canonical names, lowercase variants, and industry aliases.
 */
export type TalosWorkflowStatus =
  | TalosCanonicalWorkflowStatus
  | 'new'
  | 'created'
  | 'draft'
  | 'CREATED'
  | 'DRAFT'
  | 'pending'
  | 'queued'
  | 'scheduled'
  | 'waiting'
  | 'QUEUED'
  | 'SCHEDULED'
  | 'WAITING'
  | 'in-progress'
  | 'in_progress'
  | 'IN_PROGRESS'
  | 'running'
  | 'executing'
  | 'RUNNING'
  | 'EXECUTING'
  | 'paused'
  | 'suspended'
  | 'on_hold'
  | 'on-hold'
  | 'waiting_for_approval'
  | 'SUSPENDED'
  | 'ON_HOLD'
  | 'ON-HOLD'
  | 'WAITING_FOR_APPROVAL'
  | 'retrying'
  | 'up_for_retry'
  | 'up-for-retry'
  | 'UP_FOR_RETRY'
  | 'UP-FOR-RETRY'
  | 'skipped'
  | 'bypassed'
  | 'ignored'
  | 'SKIPPED'
  | 'BYPASSED'
  | 'IGNORED'
  | 'success'
  | 'succeeded'
  | 'passed'
  | 'SUCCEEDED'
  | 'PASSED'
  | 'completed'
  | 'finished'
  | 'done'
  | 'FINISHED'
  | 'DONE'
  | 'error'
  | 'failed'
  | 'failure'
  | 'FAILED'
  | 'FAILURE'
  | 'terminated'
  | 'cancelled'
  | 'canceled'
  | 'aborted'
  | 'stopped'
  | 'killed'
  | 'CANCELLED'
  | 'CANCELED'
  | 'ABORTED'
  | 'STOPPED'
  | 'KILLED'
  | 'expired'
  | 'timeout'
  | 'timed_out'
  | 'timed-out'
  | 'stale'
  | 'TIMEOUT'
  | 'TIMED_OUT'
  | 'TIMED-OUT'
  | 'STALE';

/**
 * Visual variant presentation styles.
 */
export type TalosStatusTagVariant = 'subtle' | 'solid' | 'outline' | 'dot';

/**
 * Size scale for the status tag.
 */
export type TalosStatusTagSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Border radius shape style for the status tag.
 */
export type TalosStatusTagShape = 'rounded' | 'pill' | 'square';

/**
 * Status descriptor containing default metadata.
 */
export interface TalosStatusDescriptor {
  readonly canonical: TalosCanonicalWorkflowStatus;
  readonly defaultLabel: string;
  readonly defaultAriaLabel: string;
  readonly cssModifier: string;
  readonly shouldAnimateIcon?: boolean;
}

/**
 * Normalizes any recognized status string or alias into its canonical status.
 */
export function normalizeWorkflowStatus(status: string | null | undefined): TalosCanonicalWorkflowStatus {
  if (!status) {
    return 'PENDING';
  }

  const clean = status.trim().toUpperCase().replace(/[\s_]+/g, '-');

  switch (clean) {
    case 'NEW':
    case 'CREATED':
    case 'DRAFT':
      return 'NEW';

    case 'PENDING':
    case 'QUEUED':
    case 'SCHEDULED':
    case 'WAITING':
      return 'PENDING';

    case 'IN-PROGRESS':
    case 'INPROGRESS':
    case 'RUNNING':
    case 'EXECUTING':
    case 'ACTIVE':
      return 'IN-PROGRESS';

    case 'PAUSED':
    case 'SUSPENDED':
    case 'ON-HOLD':
    case 'ONHOLD':
    case 'WAITING-FOR-APPROVAL':
    case 'BLOCKED':
      return 'PAUSED';

    case 'RETRYING':
    case 'UP-FOR-RETRY':
    case 'RETRY':
      return 'RETRYING';

    case 'SKIPPED':
    case 'BYPASSED':
    case 'IGNORED':
      return 'SKIPPED';

    case 'SUCCESS':
    case 'SUCCEEDED':
    case 'PASSED':
    case 'OK':
      return 'SUCCESS';

    case 'COMPLETED':
    case 'FINISHED':
    case 'DONE':
      return 'COMPLETED';

    case 'ERROR':
    case 'FAILED':
    case 'FAILURE':
    case 'CRASHED':
      return 'ERROR';

    case 'TERMINATED':
    case 'CANCELLED':
    case 'CANCELED':
    case 'ABORTED':
    case 'STOPPED':
    case 'KILLED':
      return 'TERMINATED';

    case 'EXPIRED':
    case 'TIMEOUT':
    case 'TIMED-OUT':
    case 'TIMEDOUT':
    case 'STALE':
      return 'EXPIRED';

    default:
      return 'PENDING';
  }
}

/**
 * Status descriptors map with default metadata.
 */
export const TALOS_STATUS_DESCRIPTORS: Record<TalosCanonicalWorkflowStatus, TalosStatusDescriptor> = {
  'NEW': {
    canonical: 'NEW',
    defaultLabel: 'New',
    defaultAriaLabel: 'Status: New',
    cssModifier: 'new'
  },
  'PENDING': {
    canonical: 'PENDING',
    defaultLabel: 'Pending',
    defaultAriaLabel: 'Status: Pending',
    cssModifier: 'pending'
  },
  'IN-PROGRESS': {
    canonical: 'IN-PROGRESS',
    defaultLabel: 'In Progress',
    defaultAriaLabel: 'Status: In Progress',
    cssModifier: 'inprogress',
    shouldAnimateIcon: true
  },
  'PAUSED': {
    canonical: 'PAUSED',
    defaultLabel: 'Paused',
    defaultAriaLabel: 'Status: Paused',
    cssModifier: 'paused'
  },
  'RETRYING': {
    canonical: 'RETRYING',
    defaultLabel: 'Retrying',
    defaultAriaLabel: 'Status: Retrying',
    cssModifier: 'retrying',
    shouldAnimateIcon: true
  },
  'SKIPPED': {
    canonical: 'SKIPPED',
    defaultLabel: 'Skipped',
    defaultAriaLabel: 'Status: Skipped',
    cssModifier: 'skipped'
  },
  'SUCCESS': {
    canonical: 'SUCCESS',
    defaultLabel: 'Success',
    defaultAriaLabel: 'Status: Success',
    cssModifier: 'success'
  },
  'COMPLETED': {
    canonical: 'COMPLETED',
    defaultLabel: 'Completed',
    defaultAriaLabel: 'Status: Completed',
    cssModifier: 'completed'
  },
  'ERROR': {
    canonical: 'ERROR',
    defaultLabel: 'Error',
    defaultAriaLabel: 'Status: Error',
    cssModifier: 'error'
  },
  'TERMINATED': {
    canonical: 'TERMINATED',
    defaultLabel: 'Terminated',
    defaultAriaLabel: 'Status: Terminated',
    cssModifier: 'terminated'
  },
  'EXPIRED': {
    canonical: 'EXPIRED',
    defaultLabel: 'Expired',
    defaultAriaLabel: 'Status: Expired',
    cssModifier: 'expired'
  }
};
