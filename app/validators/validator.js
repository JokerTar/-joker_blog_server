const {Rule, LinValidator} = require('../../core/lin-validator')
const {User} = require('../modules/user')
const {Blog} = require('../modules/blog')

class RegisterValidator extends LinValidator{
    constructor() {
        super()

        this.email = [
            new Rule('isEmail', '不符合email规范')
        ]

        this.nikename = [
            new Rule('isLength', '不符合长度规范', {
                min: 4,
                max: 32
            })
        ]

        this.password1 = [
            new Rule('isLength', '不符合长度规范', {
                min: 4,
                max: 32
            }),

            new Rule('matches', '密码应由数字、大写字母、小写字符、特殊符号组成', '^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{8,30}$')
        ]

        this.password2 = this.password1
    }

    validatePassword(vals) {
        const psw1 = vals.body.password1
        const psw2 = vals.body.password2

        if(psw1 !== psw2) {
            throw new Error('两个密码必须相同')
        }
    }

    async validateEmail(vals) {
        const email = vals.body.email

        const user = await User.findOne({
            where: {
                email: email
            }
        })

        if (user) {
            throw new Error('Email已存在')
        }
    }
}

class TokenValidator extends LinValidator{
    constructor() {
        super()

        this.email = [
            new Rule('isEmail', 'Email格式不正确')
        ]

        this.password = [
            new Rule('isLength', '不符合长度规范', {
                min: 4,
                max: 32
            }),

            new Rule('matches', '密码应包含数字、字母', '^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,16})$')
        ]
    }
}

class BlogValidator extends LinValidator{
    constructor() {
        super()

        this.title = [
            new Rule('isLength', '长度不符合规范', {
                min: 1
            })
        ]

        // this.description = [
        //     new Rule('isLength', '长度不符合规范', {
        //         min: 1
        //     })
        // ]

        this.content = [
            new Rule('isLength', '长度不符合规范', {
                min: 1
            })
        ]
    }

    // async validateTitle(vals) {
    //     const title = vals.body.title
    //     const blog = await Blog.findOne({
    //         where: {
    //             title: title
    //         }
    //     })

    //     if (blog) throw new Error('标题已存在')
    // }

    async validateUid(vals) {
        const uid = vals.auth.uid
        if (!uid) throw new Error('作者不存在')

        const auth = await User.findOne({
            where: {
                id: uid
            }
        })

        if (!auth) throw new Error('作者不存在')
    }
}

class DeleteValidator extends LinValidator{
    constructor() {
        super()

        this.id = [
            new Rule('isLength', 'id必填', {
                min: 1
            })
        ]
    }
}

class FocusValidator extends LinValidator{
    constructor() {
        super()
    }

    // validateBid(vals) {
    //     const bid = vals.body.bid
    //     const uid = vals.body.uid

    //     if(bid == uid) {
    //         throw new Error('不能关注自己')
    //     }
    // }
}

class UpdateUserValidator extends LinValidator{
    constructor() {
        super()
        this.nikename = [
            new Rule('isOptional', '', ),
            new Rule('isLength', '长度不符合规范', {
                min: 1
            })
        ]

        this.avatar = [
            new Rule('isOptional', '', ),
            new Rule('isLength', '图片符合规范', {
                min: 1
            })
        ]

        this.member_cover = [
            new Rule('isOptional', '', ),
            new Rule('isLength', '图片不符合规范', {
                min: 1
            })
        ]

        this.signature = [
            new Rule('isOptional', '', ),
            new Rule('isLength', '不超过20个汉字或40个字符', {
                min: 1,
                max: 40
            })
        ]

        this.tag = [
            new Rule('isOptional', '', ),
            new Rule('isLength', '不超过160个汉字或320个字符', {
                min: 1,
                max: 320
            })
        ]

        this.qq = [
            new Rule('isOptional', '', ),
            new Rule('isLength', 'qq不符合规范', {
                min: 1,
                max: 18
            })
        ]

        this.wx = [
            new Rule('isOptional', '', ),
            new Rule('isLength', 'wx不符合规范', {
                min: 1,
                max: 18
            })
        ]
    }

    async validateGender(vals) {
        const gender = vals.body.gender
        const arr = ['男', '女']

        if (gender && !arr.includes(gender)) {
            throw new Error('请输入 男 女')
        }
    }
}

class ViewValidator extends LinValidator{
    constructor() {
        super()

        this.uid = [
            new Rule('isOptional', '', ),
            new Rule('isLength', 'uid不符合规范', {
                min: 1
            })
        ]

        this.bid = [
            new Rule('isLength', 'bid不符合规范', {
                min: 1
            })
        ]
    }
}

class SearchValidator extends LinValidator{
    constructor() {
        super()
        this.page = [
            new Rule('isInt', 'page参数不符合规范', {
                min: 0
            }),
            // new Rule('isOptional', '', 0)
        ]

        this.currentPage = [
            new Rule('isInt', 'currentPage参数不符合规范', {
                min: 1,
                max: 20
            }),
            // new Rule('isOptional', '', 10)
        ]

        this.keyWord = [
            new Rule('isOptional', '', ),
            new Rule('isLength', 'keyWord参数不符合规范', {
                min: 1,
                max: 16
            })
        ]

        this.order = [
            new Rule('isOptional', '', ),
            new Rule('isArray', 'keyWord参数不符合规范', [])
        ]
    }
}

class CommentValidator extends LinValidator{
    constructor() {
        super()
        this.rootid = [
            new Rule('isOptional', '', ),
            new Rule('isLength', 'rootid不符合规范', {
                min: 1
            })
        ]

        this.replyid = [
            new Rule('isOptional', '', ),
            new Rule('isLength', 'replyid不符合规范', {
                min: 1
            })
        ]

        this.bid = [
            new Rule('isLength', 'bid必填', {
                min: 1
            })
        ]
        this.content = [
            new Rule('isLength', '评论格式不正确', {
                min: 1
            })
        ]
    }
}

class LikeValidator extends LinValidator{
    constructor() {
        super()

        this.bid = [
            new Rule('isLength', 'bid不符合规范', {
                min: 1
            })
        ]

        this.uid = [
            new Rule('isOptional', '', ),
            new Rule('isLength', 'uid不符合规范', {
                min: 1
            })
        ]

        this.type = [
            new Rule('isLength', 'type不符合规范', {
                min: 1
            })
        ]
    }

    async validateType(vals) {
        const type = vals.body.type
        const arr = [100, 200]

        if (!arr.includes(type)) {
            throw new Error('type不符合规范')
        }
    }
}

class UnlikeValidator extends LinValidator{
    constructor() {
        super()

        this.bid = [
            new Rule('isLength', 'bid不符合规范', {
                min: 1
            })
        ]

        this.type = [
            new Rule('isLength', 'type不符合规范1', {
                min: 1
            })
        ]
    }

    async validateType(vals) {
        const type = vals.body.type
        const arr = [100, 200]

        if (!arr.includes(type)) {
            throw new Error('type不符合规范')
        }
    }
}

class CollectionValidator extends LinValidator{
    constructor() {
        super()

        this.bid = [
            new Rule('isLength', 'bid不符合规范', {
                min: 1
            })
        ]
    }
}

class ColumnValidator extends LinValidator{
    constructor() {
        super()

        this.title = [
            new Rule('isLength', 'title不符合规范', {
                min: 1
            })
        ]

        this.introduce = [
            new Rule('isLength', 'title不符合规范', {
                min: 1
            })
        ]

        this.cover = [
            new Rule('isOptional', '', ),
            new Rule('isLength', '图片符合规范', {
                min: 1
            })
        ]
    }
}

class ColumnManagerValidator extends LinValidator{
    constructor() {
        super()
    }
}

module.exports = {
    RegisterValidator,
    TokenValidator,
    BlogValidator,
    FocusValidator,
    DeleteValidator,
    UpdateUserValidator,
    ViewValidator,
    SearchValidator,
    CommentValidator,
    LikeValidator,
    UnlikeValidator,
    CollectionValidator,
    ColumnValidator,
    ColumnManagerValidator
}