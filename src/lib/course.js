import axios from 'axios';
import cheerio from 'cheerio';

export default class {
	constructor(){
		let self = this;
		axios.get('https://w5.ab.ust.hk/wcq/cgi-bin/').then( (response) => {
			let $ = cheerio.load(response.data);
			self.base = `https://w5.ab.ust.hk/wcq/cgi-bin/${$('div.termselect>a').first().attr('href').split('/')[3]}`;
		});
	}

	all(){
		console.log(this.base);
		return axios.get('https://w5.ab.ust.hk/wcq/cgi-bin/').then( (response) => {
			let $ = cheerio.load(response.data);
			return $('.depts>a').map((i, ctx) => {
				return $(ctx).text();
			}).get();
		});
	}

	subjects(department){
		console.log(this.base);
		return axios.get(this.base + '/subject/' + department).then( (response) => {
			let $ = cheerio.load(response.data);
			return $('.course').map((i, ctx) => {
				return {
					code: $(ctx).find('.courseanchor>a').attr('name'),
					name: $(ctx).find('h2').text().split('- ')[1].split(' (')[0],
					sections: $(ctx).find('tr.newsect').map((i, d) => {
						let s = $(d).find('td').first().text().split(' (')[0];
						let r = $(d).find('td').first().text().split(' (')[1].split(')')[0];
						let v = $(d).find('td:nth-child(3)').text();
						let t = $(d).find('td:nth-child(4)>a').map((i, n) => {
								return $(n).text();
							}).get();
						let q = $(d).find('td:nth-child(5)').text();
						let e = $(d).find('td:nth-child(6)').text();
						let a = $(d).find('td:nth-child(7)').text();
						let w = $(d).find('td:nth-child(8)').text();
						return {
							section: s,
							ref_no: r,
							venue: v,
							instructor: t,
							quota: q,
							enrolled: e,
							available: a,
							wait: w
						}
					}).get()
				}}).get();
		});
	}


}