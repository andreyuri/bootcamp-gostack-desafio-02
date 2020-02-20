import Sequelize, { Model } from 'sequelize';

class DeliveryProblem extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Deliverie, {
      foreignKey: 'delivery_id',
      as: 'deliverie',
    });
  }
}

export default DeliveryProblem;
