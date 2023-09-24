enum PossibleActions {
	Delete,
	DeleteOther,
	Merge,
	Continue,
	Quit,
}

type MergedItem<T> = T
type CompareFnMergedReturnType<T> = [PossibleActions.Merge, MergedItem<T>]

type CompareFnReturnType<T> =
	| CompareFnMergedReturnType<T>
	| Exclude<PossibleActions, PossibleActions.Merge>
	| undefined

const possibleActionsObject = {
	delete: PossibleActions.Delete as const,
	deleteOther: PossibleActions.DeleteOther as const,
	mergeInto: <T>(mergedItem: MergedItem<T>): CompareFnMergedReturnType<T> => [
		PossibleActions.Merge as const,
		mergedItem,
	],
	continue: PossibleActions.Continue as const,
	quit: PossibleActions.Quit as const,
}

export function compareAndMergeListItems<T = unknown>(
	list: T[],
	compare: (
		item: T,
		otherItem: T,
		actions: typeof possibleActionsObject,
	) => CompareFnReturnType<T>,
	compareOnlySpecificItems?: T[],
) {
	const alreadyComparedItems: T[] = []
	const newItems: T[] = []

	mainLoop: for (const item of list) {
		// check only specific item and eventual merge results
		if (
			compareOnlySpecificItems &&
			compareOnlySpecificItems.length > 0 &&
			![...compareOnlySpecificItems, ...newItems].includes(item)
		)
			continue

		for (const otherItem of list) {
			if (item === otherItem) continue
			if (!newItems.includes(item) && alreadyComparedItems.includes(otherItem))
				continue

			const result = compare(item, otherItem, possibleActionsObject)

			if (result === PossibleActions.Delete) {
				list.splice(list.indexOf(item), 1)
				continue
			}
			if (result === PossibleActions.DeleteOther) {
				list.splice(list.indexOf(otherItem), 1)
				continue
			}
			if (
				((
					result: CompareFnReturnType<T>,
				): result is CompareFnMergedReturnType<T> =>
					result?.[0] === PossibleActions.Merge)(result)
			) {
				list.splice(list.indexOf(item), 1)
				list.splice(list.indexOf(otherItem), 1)
				list.push(result[1])

				// the outer loop will continue with the next item
				continue mainLoop
			}
			if (result === PossibleActions.Continue) {
				continue
			}
			if (result === PossibleActions.Quit) {
				return
			}
		}
	}
}
