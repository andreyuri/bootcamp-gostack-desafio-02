import * as Yup from 'yup';
import { Op } from 'sequelize';

import Deliverie from '../models/Deliverie';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import DeliverieMail from '../jobs/DeliverieMail';
import Queue from '../../lib/Queue';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.findByPk(req.body.recipient_id);
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const {
      id,
      product,
      recipient_id,
      deliveryman_id,
    } = await Deliverie.create(req.body);

    await Queue.add(DeliverieMail.key, {
      deliveryman,
      recipient,
      product,
    });

    return res.json({
      id,
      product,
      recipient_id,
      deliveryman_id,
    });
  }

  async index(req, res) {
    const { page = 1, q } = req.query;

    const deliveries = await Deliverie.findAll({
      where: {
        canceled_at: null,
        product: q ? { [Op.iLike]: `%${q}%` } : { [Op.ne]: null },
      },
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name', 'postal_code'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const deliverie = await Deliverie.findByPk(req.params.id);
    if (!deliverie) {
      return res.status(400).json({ error: 'Deliverie does not exists' });
    }

    await deliverie.update(req.body);

    return res.json(deliverie);
  }

  async delete(req, res) {
    const deliverie = await Deliverie.findByPk(req.params.id);
    if (!deliverie) {
      return res.status(400).json({ error: 'Invalid deliverie' });
    }

    if (deliverie.canceled_at) {
      return res.status(400).json({ error: 'Delivery already canceled' });
    }

    deliverie.canceled_at = new Date();

    await deliverie.save();

    return res.json(deliverie);
  }
}

export default new DeliveryController();
