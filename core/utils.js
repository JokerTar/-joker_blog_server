const jwt = require('jsonwebtoken')
const {secretKey, expiresIn} = require('../config/config').security

const findMembers = function (instance, {
    prefix,
    specifiedType,
    filter
}) {
    // 递归函数
    function _find(instance) {
        //基线条件（跳出递归）
        if (instance.__proto__ === null)
            return []

        let names = Reflect.ownKeys(instance)
        names = names.filter((name) => {
            // 过滤掉不满足条件的属性或方法名
            return _shouldKeep(name)
        })

        return [...names, ..._find(instance.__proto__)]
    }

    function _shouldKeep(value) {
        if (filter) {
            if (filter(value)) {
                return true
            }
        }
        if (prefix)
            if (value.startsWith(prefix))
                return true
        if (specifiedType)
            if (instance[value] instanceof specifiedType)
                return true
    }

    return _find(instance)
}

const generateToken = (uid, scope = 2) => {
    const token = jwt.sign({
        uid,
        scope
    }, secretKey, {
        expiresIn
    })
    return token
}

const listToTree = (root, arr, { id, rootid, child }, result = []) => {
    const list = result

    if (!root) {
      arr.forEach(item => {
        listToTree(item, arr, { id, rootid, child }, list)
      })
    } else {
      if (!root[rootid]) {
        list.push({
          ...root,
          [child]: getChild(root, arr.filter(item => item[rootid]), { id, rootid, child })
        })
      }
    }

    return list
}

const getChild = (root, arr, { id, rootid, child }) => {
const list = []

arr.forEach(item => {
    if (item[rootid] === root[id]) {
        list.push({
            ...item,
            // [child]: getChild(item, arr.filter(item => item[rootid]), { id, rootid, child })
        })
    }
})
return list
}

module.exports = {
    findMembers,
    generateToken,
    listToTree
}