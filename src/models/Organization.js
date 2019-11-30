
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
        userlist : {
            type : DataTypes.JSON,
            allowNUll : true
        },
        user_count : {
            type : DataTypes.INTEGER,
            allowNUll : false
        },
        location : {
            type : DataTypes.STRING,
            allowNUll : false
        },
        start_time : {
            type : DataTypes.DATE,
            allowNUll : false
        },
        finish_time : {
            type : DataTypes.DATE,
            allowNUll : false
        },
        dev_types : {
            type : DataTypes.JSON,
            allowNUll : true
        }
    });
};