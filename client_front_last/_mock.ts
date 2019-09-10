import { parse } from 'url';
import { TableListItem, TableListParams } from './data';
// mock tableListDataSource
let tableListDataSource: TableListItem[] = [];


tableListDataSource.push(
	{
    client_id: `0`,
    client_name:`abc`,
	vip_name:`超级管理员`,
    last_login: new Date(`2017-07-${Math.floor(0/ 2) + 1}`),
	vip_id: `3`,
	phonenum: `123456`,
	password:`ascdd`,
	},
		{
    client_id: `1`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-${Math.floor(1 / 2) + 1}`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
		{
    client_id: `2`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-${Math.floor(2 / 2) + 1}`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
		{
    client_id: `3`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-${Math.floor(3 / 2) + 1}`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
		{
    client_id: `4`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-${Math.floor(4 / 2) + 1}`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
		{
    client_id: `5`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-${Math.floor(5/ 2) + 1}`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
	
			{
    client_id: `6`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-${Math.floor(6/ 2) + 1}`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
			{
    client_id: `7`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-${Math.floor(7/ 2) + 1}`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
				{
    client_id: `8`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-08`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
					{
    client_id: `9`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-09`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
					{
    client_id: `10`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-08`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
					{
    client_id: `11`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-08`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
					{
    client_id: `12`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-08`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
					{
    client_id: `13`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-08`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
					{
    client_id: `14`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-08`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
					{
    client_id: `15`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-08`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
					{
    client_id: `16`,
    client_name:`abc`,
	vip_name:`普通管理员`,
    last_login: new Date(`2017-07-08`),
	vip_id: `2`,
	phonenum: `123456`,
	password:`ascdd`,
	},
	
  );


function getTVWSUser(
  req: { url: any },
  res: {
    json: (
      arg0: {
        list: TableListItem[];
        pagination: { total: number; pageSize: number; current: number };
      },
    ) => void;
  },
  u: any,
) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = (parse(url, true).query as unknown) as TableListParams;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource: TableListItem[] = [];
    status.forEach((s: string) => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(item => {
          if (parseInt(item.status + '', 10) === parseInt(s.split('')[0], 10)) {
            return true;
          }
          return false;
        }),
      );
    });
    dataSource = filterDataSource;
  }

  if (params.client_id) {
    dataSource = dataSource.filter(data => data.client_id.indexOf(params.client_id) > -1);
  }

  let pageSize: number = 10;
  if (params.pageSize) {
    pageSize = parseInt(params.pageSize + '', 0);
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    },
  };

  return res.json(result);
}

function postTVWSUser(
  req: { url: any; body: any },
  res: { json: (arg0: { list: TableListItem[]; pagination: { total: number } }) => void },
  u: any,
  b: { body: any },
) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, client_id, client_name, vip_name, last_login } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':

       tableListDataSource = tableListDataSource.filter(item => client_id.indexOf(item.client_id) === -1);

      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
		client_id: i,
		client_name:`新用户`,
		vip_name:`普通用户`,
		last_login: new Date(`2017-07-11`),
/*		vip_id: `1`,
		phonenum: `123456`,
		password:`ascdd`, */
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.client_id === client_id) {
          Object.assign(item, { client_id });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  return res.json(result);
}

export default {
  'GET /api/client': getTVWSUser,
  'POST /api/client': postTVWSUser,
  'POST /api/removeClient': postTVWSUser,
  'POST /api/updateClient': postTVWSUser,
  
};
