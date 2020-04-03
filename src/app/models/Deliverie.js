import Sequelize, { Model } from 'sequelize';

class Deliverie extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        status: Sequelize.VIRTUAL,
        color: Sequelize.VIRTUAL,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });

    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });

    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });

    this.hasMany(models.DeliveryProblem, {
      foreignKey: 'delivery_id',
      as: 'deliverieproblem',
    });
  }
}

export default Deliverie;
