/*
 * @Author: bianjie
 * @Date: 2021-01-04 14:09:10
 * @LastEditors: bianjie
 * @LastEditTime: 2021-01-18 11:09:38
 */
// 我这个封装通过promise返回出去！！！
// 我这个封装通过promise返回出去！！！
// 创建数据库或者有该数据库就打开,    这一步必须要！
function openSqlite(name) {
  // 创建数据库或者打开
  // 这plus.sqlite只在手机上运行
  return new Promise((resolve, reject) => {
    plus.sqlite.openDatabase({
      name, // 数据库名称
      path: `_doc/${name}.db`, // 数据库地址，uniapp推荐以下划线为开头，这到底存在哪里去了，我也不清楚，哈哈
      success(e) {
        resolve(e); // 成功回调
      },
      fail(e) {
        reject(e); // 失败回调
      },
    });
  });
}

// 在该数据库里创建表格，   这一步也必须要！
// 下面注释里说的都是说sql:'create table if not exists....这里
// userInfo是表格名，你也可以写其他的名，不能用数字作为表格名的开头！！！
// 括号里是表格的结构，列，这里我写了四列，list,id,gender,avatar这四列
// list后面大写的英文是自动增加的意思，因为表格里的每一行必须有唯一标识
// 这sql语句会数据库的应该都看的懂，我是前端菜鸡，所以详细说明以便跟我一样不懂sql的前端看
// "id" TEXT  意思是这一列放的值为字符串之类的，如果是想存数字之类的就改为INTEGER
// 数据库不能存对象，数组
function messageInfoSQL(name) {
  return new Promise((resolve, reject) => {
    // 创建表格在executeSql方法里写
    plus.sqlite.executeSql({
      name,
      // 表格创建或者打开，后面为表格结构
      sql: 'create table if not exists message("list" INTEGER PRIMARY KEY AUTOINCREMENT,"from" TEXT,"ficon" TEXT,"to" TEXT,"ticon" TEXT,"content" TEXT,"createTime" TEXT,"type" INTEGER)',
      success(e) {
        resolve(e);
      },
      fail(e) {
        reject(e);
      },
    });
  });
}

// 在该数据库里创建表格，   这一步也必须要！
// 下面注释里说的都是说sql:'create table if not exists....这里
// userInfo是表格名，你也可以写其他的名，不能用数字作为表格名的开头！！！
// 括号里是表格的结构，列，这里我写了四列，list,id,gender,avatar这四列
// list后面大写的英文是自动增加的意思，因为表格里的每一行必须有唯一标识
// 这sql语句会数据库的应该都看的懂，我是前端菜鸡，所以详细说明以便跟我一样不懂sql的前端看
// "id" TEXT  意思是这一列放的值为字符串之类的，如果是想存数字之类的就改为INTEGER
// 数据库不能存对象，数组
function temporaryInfoSQL(name) {
  return new Promise((resolve, reject) => {
    // 创建表格在executeSql方法里写
    plus.sqlite.executeSql({
      name,
      // 表格创建或者打开，后面为表格结构
      sql: 'create table if not exists temporary("list" INTEGER PRIMARY KEY AUTOINCREMENT,"uid" TEXT,"fuid" TEXT UNIQUE,"funame" TEXT,"uname" TEXT,"fuicon" TEXT)',
      success(e) {
        resolve(e);
      },
      fail(e) {
        reject(e);
      },
    });
  });
}
// 消息插入本地库
function insertInformationType(name, from, ficon, to, ticon, content, createTime, type) {
  return new Promise((resolve, reject) => {
    // 创建表格在executeSql方法里写
    plus.sqlite.executeSql({
      name,
      // 表格创建或者打开，后面为表格结构
      sql: `insert into message ('from',ficon,'to',ticon,content,createTime,type) values ('${from}','${ficon}','${to}','${ticon}','${content}','${createTime}',${type})`,
      success(e) {
        resolve(e);
      },
      fail(e) {
        reject(e);
      },
    });
  });
}
// 零时信息插入本地库
function insertTemporaryInfo(name, uid, fuid, funame, uname, fuicon) {
  return new Promise((resolve, reject) => {
    // 创建表格在executeSql方法里写
    plus.sqlite.executeSql({
      name,
      // 表格创建或者打开，后面为表格结构
      sql: `insert into temporary (uid,fuid,funame,uname,fuicon) values ('${uid}','${fuid}','${funame}','${uname}','${fuicon}')`,
      success(e) {
        resolve(e);
      },
      fail(e) {
        reject(e);
      },
    });
  });
}
// 零时用户查询
function selectTemporary(name, uid) {
  return new Promise((resolve, reject) => {
    // 创建表格在executeSql方法里写
    plus.sqlite.selectSql({
      name,
      // 表格创建或者打开，后面为表格结构
      sql: `select * from temporary where "uid"='${uid}' order by list`,
      success(e) {
        resolve(e);
      },
      fail(e) {
        reject(e);
      },
    });
  });
}

// 查询获取数据库里的数据
// 根据传过来的值来获取信息，我这里写了可以有两个条件来获取，都是动态的
// 第一个参数为表格名，aa,bb分别为列名和列的值 ， cc,dd同前面
// 传的参数按1,3,5来传，传一个，传三个，传五个参数，不能只传两个或者四个
function selectInformationType(name, start, limit, aa) {
  if (name !== undefined) {
    // 第一个是表单名称，后两个参数是列表名，用来检索
    let sql = '';
    if (aa !== undefined) {
      // 两个检索条件
      sql = `select * from message where "from"='${aa}' or "to"='${aa}' order by list desc limit ${limit} offset ${start}`;
    }
    return new Promise((resolve, reject) => {
      plus.sqlite.selectSql({
        name,
        sql,
        success(e) {
          resolve(e);
        },
        fail(e) {
          reject(e);
        },
      });
    });
  }
}

// 查询获取数据库里的数据
// 根据传过来的值来获取信息，我这里写了可以有两个条件来获取，都是动态的
// 第一个参数为表格名，aa,bb分别为列名和列的值 ， cc,dd同前面
// 传的参数按1,3,5来传，传一个，传三个，传五个参数，不能只传两个或者四个
function countInformationType(name, aa) {
  if (name !== undefined) {
    // 第一个是表单名称，后两个参数是列表名，用来检索
    let sql = '';
    if (aa !== undefined) {
      // 两个检索条件
      sql = `select count(*) as num from message where "from"='${aa}' or "to"='${aa}'`;
    }
    return new Promise((resolve, reject) => {
      plus.sqlite.selectSql({
        name,
        sql,
        success(e) {
          resolve(e);
        },
        fail(e) {
          reject(e);
        },
      });
    });
  }
}

// 删除数据库里的数据
// 参数跟上面查询获取数据一样
// 传的参数按1,3,5来传，传一个，传三个，传五个参数，不能只传两个或者四个
function deleteInformationType(name, sol, qq, ww, ee) {
  if (name !== undefined && sol !== undefined) {
    // listId为表名,后面两个是列表名，检索用的
    let sql = '';
    if (ww !== undefined) {
      // 两个检索条件
      sql = `delete from ${name} where ${sol}="${qq}" and ${ww}=${ee}`;
    } else {
      // 一个检索条件
      sql = `delete from ${name} where ${sol}="${qq}"`;
    }
    return new Promise((resolve, reject) => {
      plus.sqlite.executeSql({
        name,
        sql,
        success(e) {
          resolve(e);
        },
        fail(e) {
          reject(e);
        },
      });
    });
  }
}

// 修改数据表里的数据
// 第一个参数为表格名，name为要修改的列名，cont为要修改为什么值，use,sel为搜索条件，分别是列名和列值
// 传的参数按1,3,5来传，传一个，传三个，传五个参数，不能只传两个或者四个
function modifyInformation(listName, name, cont, use, sel) {
  // 表格名，要修改地方的列名，修改后的内容，修改条件查询，列名，内容
  let sql;
  if (use === undefined) {
    sql = `update ${listName} set ${name}="${cont}"`;
  } else {
    sql = `update ${listName} set ${name}="${cont}" where ${use}="${sel}"`;
  }
  // where前面的是要修改的，后面的是条件，选择哪个
  return new Promise((resolve, reject) => {
    plus.sqlite.executeSql({
      name: 'pop',
      sql,
      success(e) {
        resolve(e);
      },
      fail(e) {
        reject(e);
      },
    });
  });
}

// 关闭数据库
function closeSQL(name) {
  return new Promise((resolve, reject) => {
    plus.sqlite.closeDatabase({
      name,
      success(e) {
        resolve(e);
      },
      fail(e) {
        reject(e);
      },
    });
  });
}

// 监听数据库是否开启
function isOpen(name, path) {
  const ss = name;
  const qq = path || `_doc/${name}.db`;
  // 数据库打开了就返回true,否则返回false
  const open = plus.sqlite.isOpenDatabase({
    name: ss,
    path: qq,
  });
  return open;
}

// 一次获取指定数据条数
// 不想一次性把数据全拿过来就可以这样写
// id为表格名，desc代表倒序拿数据，正常是从第一条开始拿，倒序就从最后一条也是最新的一条数据开始拿
// limit 15 offset '+num+''，后面这是两个单引号，这句的意思是跳过多少条拿15条数据，num是动态值
// 比如你刚开始给num设为0，那就从最后面的数据开始拿15条，你下次肯定不想再拿刚刚获取到的数据，所以可以让num为15，这样就能一步一步的拿完所有的数据
function pullSQL(id, num) {
  // id为表名，num为跳过多少条数据
  // 根据list来倒序拿数据，跳过num条拿取15条
  return new Promise((resolve, reject) => {
    plus.sqlite.selectSql({
      name: 'pop',
      sql: `select * from ${id} order by list desc limit 15 offset ${num}`,
      success(e) {
        resolve(e);
      },
      fail(e) {
        reject(e);
      },
    });
  });
}
// 把这些方法导出去
export {
  openSqlite,
  messageInfoSQL,
  insertInformationType,
  selectInformationType,
  countInformationType,
  deleteInformationType,
  pullSQL,
  isOpen,
  closeSQL,
  modifyInformation,
  temporaryInfoSQL,
  insertTemporaryInfo,
  selectTemporary,
};
