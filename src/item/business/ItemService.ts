import fetch, { FetchError } from 'node-fetch';
import { Observable } from 'rxjs';
import { config } from '../../config';
import { IEncodedItem } from '../model';
import { encodeRle } from './encoding';

const ITEMS_API_URL = config.itemsApi.url;
export class ItemService {
	public static fetchAndEncodeItems(): Observable<IEncodedItem[]> {
		const observableOfItems: Observable<string[]> = new Observable(
			subscriber => {
				fetch(ITEMS_API_URL).then(response => {
					const body = response.body;
					body.on('data', data => {
						const items = data
							.toString()
							.split('\n')
							.filter(item => item !== '');
						subscriber.next(items);
					});
					body.on('end', () => {
						subscriber.complete();
					});
				});
			}
		);
		return encodeRle(observableOfItems);
	}

	public static getItemInIndex(
		encodedItemsCache: IEncodedItem[],
		searchIndex: number
	): string {
		if (searchIndex < 0) {
			return '';
		}

		let currIndex = -1;
		for (const encodedItem of encodedItemsCache) {
			const { count, item } = encodedItem;
			currIndex += count;
			if (searchIndex <= currIndex) {
				return item;
			}
		}

		return '';
	}
}
