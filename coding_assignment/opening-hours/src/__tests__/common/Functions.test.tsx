import { formulatedData } from '../../utills/functions';
import { primaryDataSet, secondaryDataSet }  from '../../assests/test-data';
test('test the formulatedData', () => {
	// data set one
	const firstDataset = formulatedData(primaryDataSet);
	expect(firstDataset.length).toBe(7);
	// data set one
	const SecondDataset = formulatedData(secondaryDataSet);
	expect(SecondDataset.length).toBe(2);
});
