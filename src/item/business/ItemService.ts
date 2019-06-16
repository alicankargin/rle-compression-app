import fetch, { FetchError } from 'node-fetch';
import { Observable } from 'rxjs';
import { encodeRle } from './encoding';
import { EncodedItem } from '../model';
import { ITEMS_URL } from '../../config';

export class ItemService {
	encodedItemsCache: Array<EncodedItem>;

	constructor(encodedItemsCache) {
		this.encodedItemsCache = encodedItemsCache;
	}

	public fetchItems(): Observable<Array<EncodedItem>> {
		const observableOfItems = new Observable(subscriber => {
			fetch(ITEMS_URL).then(response => {
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
		});
		return encodeRle(observableOfItems);
	}

	public getItemsInIndex(searchIndex: number): string {
		let currIndex = -1;
		console.log(JSON.stringify(this.encodedItemsCache));
		for (let encodedItem of this.encodedItemsCache) {
			const { count, item } = encodedItem;
			currIndex += count;
			if (searchIndex <= currIndex) {
				return item;
			}
		}
		return '';
	}
}