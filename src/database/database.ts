// import { Sequelize, QueryTypes, Dialect } from 'sequelize';

// import { development } from '../config/database';

// const { database, username, password, ...otherConfig } = development;

// const config = {
//   ...otherConfig,
//   dialect: otherConfig.dialect as Dialect,
// };

// const sequelize = new Sequelize(database, username, password, config);

// export default { sequelize, Sequelize, QueryTypes };


import { Sequelize, QueryTypes } from 'sequelize';

import { development } from '../config/database';

const { database, username, password, ...otherConfig } = development;

const sequelize = new Sequelize(database, username, password, otherConfig);

export default { sequelize, Sequelize, QueryTypes };
