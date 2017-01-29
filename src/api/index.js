import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import Course from '../lib/course';

export default ({ config, db }) => {
	let api = Router();
	let c = new Course('https://w5.ab.ust.hk/wcq/cgi-bin/1630/subject/COMP');
	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.get('/course', (req, res) => {
		c.all().then((result) => {
			res.json(result);
		});
	})

	api.get('/course/:id', (req, res) => {
		c.subjects(req.params.id).then( (result) => {
			res.json(result);
		});
	})

	return api;
}
