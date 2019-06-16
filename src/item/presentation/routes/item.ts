import express from 'express';
import { ItemService } from '../../business/ItemService';

const router = express.Router();

export const itemRouter = router.get(
	'/:index',
	async (req: any, res: any): Promise<any> => {
		const { cache, params } = req;
		const { index } = params;
		res.send(ItemService.getItemsInIndex(cache.get('encodedItems'), index));
	}
);