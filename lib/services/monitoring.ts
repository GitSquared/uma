import config from '@lib/utils/config'
import { useRootNavigation } from 'expo-router'
import RNUxcam from 'react-native-ux-cam'
import * as Sentry from 'sentry-expo'

export enum Status {
	/** The operation completed successfully. */
	Ok = 'ok',
	/** Deadline expired before operation could complete. */
	DeadlineExceeded = 'deadline_exceeded',
	/** 401 Unauthorized (actually does mean unauthenticated according to RFC 7235) */
	Unauthenticated = 'unauthenticated',
	/** 403 Forbidden */
	PermissionDenied = 'permission_denied',
	/** 404 Not Found. Some requested entity (file or directory) was not found. */
	NotFound = 'not_found',
	/** 429 Too Many Requests */
	ResourceExhausted = 'resource_exhausted',
	/** Client specified an invalid argument. 4xx. */
	InvalidArgument = 'invalid_argument',
	/** 501 Not Implemented */
	Unimplemented = 'unimplemented',
	/** 503 Service Unavailable */
	Unavailable = 'unavailable',
	/** Other/generic 5xx. */
	InternalError = 'internal_error',
	/** Unknown. Any non-standard HTTP status code. */
	UnknownError = 'unknown_error',
	/** The operation was cancelled (typically by the user). */
	Cancelled = 'cancelled',
	/** Already exists (409) */
	AlreadyExists = 'already_exists',
	/** Operation was rejected because the system is not in a state required for the operation's */
	FailedPrecondition = 'failed_precondition',
	/** The operation was aborted, typically due to a concurrency issue. */
	Aborted = 'aborted',
	/** Operation was attempted past the valid range. */
	OutOfRange = 'out_of_range',
	/** Unrecoverable data loss or corruption */
	DataLoss = 'data_loss',
}
export const captureEvent = Sentry.Native.captureEvent
export const captureException = Sentry.Native.captureException

export const startTransaction = Sentry.Native.startTransaction

const routingInstrumentation =
	new Sentry.Native.ReactNavigationInstrumentation()

export function setupMonitoring() {
	console.info('setting up monitoring...')

	// Sentry

	Sentry.init({
		dsn: config?.sentryDsn as string,
		enableInExpoDevelopment: false,
		tracesSampleRate: 1,
		debug: false,
		integrations: [
			new Sentry.Native.ReactNativeTracing({
				routingInstrumentation,
			}),
		],
	})

	// UXcam

	RNUxcam.optIntoSchematicRecordings() // Add this line to enable iOS screen recordings

	const configuration = {
		userAppKey: config?.uxCamAppKey as string,
		enableAutomaticScreenNameTagging: false,
		enableAdvancedGestureRecognition: true, // default is true
		enableImprovedScreenCapture: true, // for improved screen capture on Android
	}

	RNUxcam.startWithConfiguration(configuration)
}

// Navigation plug in for Sentry
// for uxcam it's directly in app/_layout
export function setupRoutingInstrumentation(
	navigation: ReturnType<typeof useRootNavigation>,
) {
	routingInstrumentation.registerNavigationContainer(navigation)
}
