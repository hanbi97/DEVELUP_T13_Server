
export const Organization=(sequelize,DataTypes)=>{
    return sequelize.define('organization',{
        group_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            allowNUll : false,
            autoIncrement : true
        },
        group_name : {
            type : DataTypes.STRING,
            allowNUll : false
        },
        author : {
            type : DataTypes.STRING,
            allowNUll : false
        },
        usermax_count : {
            type : DataTypes.INTEGER,
            defaultValue : 7,
            allowNUll : true
        },
        user_count : {
            type : DataTypes.INTEGER,
            defaultValue : 0,
            allowNUll : true
        },
        location : {
            type : DataTypes.STRING,
            allowNUll : false
        },
        start_time : {
            type : DataTypes.STRING,
            allowNUll : false
        },
        finish_time : {
            type : DataTypes.STRING,
            allowNUll : false
        },
        dev_types : {
            type: DataTypes.ENUM("Webfront","Webback","Server","Android","IOS"),
            allowNUll : true
        }
    });
};