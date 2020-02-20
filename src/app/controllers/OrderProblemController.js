import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Deliverie from '../models/Deliverie';
import DeliveryCancellationMail from '../jobs/DeliveryCancellationMail';
import Queue from '../../lib/Queue';
import Deliveryman from '../models/Deliveryman';

class OrderProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { deliveryId } = req.params;

    const deliveryProblems = await DeliveryProblem.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      where: {
        delivery_id: deliveryId,
      },
      attributes: ['id', 'description', 'delivery_id'],
    });

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliverie = await Deliverie.findByPk(req.params.deliveryId);

    if (!deliverie) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const { description } = req.body;

    const deliveryProblem = await DeliveryProblem.create({
      description,
      delivery_id: req.params.deliveryId,
    });

    return res.json(deliveryProblem);
  }

  async delete(req, res) {
    const { deliveryId } = req.params;

    const delivery = await Deliverie.findByPk(deliveryId, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
        },
      ],
    });
    if (!delivery) {
      return res.status(400).json({ error: 'Invalid delivery' });
    }

    const checkProblems = await DeliveryProblem.findAll({
      where: {
        delivery_id: deliveryId,
      },
    });
    if (!checkProblems || checkProblems.length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no problems for this delivery' });
    }

    await delivery.update({
      canceled_at: new Date(),
    });

    await Queue.add(DeliveryCancellationMail.key, {
      deliveryman: delivery.deliveryman,
      product: delivery.product,
    });

    return res.json();
  }
}

export default new OrderProblemController();
