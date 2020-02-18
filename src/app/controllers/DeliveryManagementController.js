import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import Deliverie from '../models/Deliverie';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryManagementController {
  async index(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const { page = 1, completed } = req.query;

    const deliveries = await Deliverie.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: completed && completed === 'true' ? { [Op.ne]: null } : null,
      },
      attributes: ['id', 'product', 'start_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name', 'city', 'state'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'url', 'path', 'name'],
        },
      ],
    });

    return res.json(deliveries);
  }
}

export default new DeliveryManagementController();
