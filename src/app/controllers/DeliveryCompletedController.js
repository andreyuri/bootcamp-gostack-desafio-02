import * as Yup from 'yup';
import Deliverie from '../models/Deliverie';
import Deliveryman from '../models/Deliveryman';

class DeliveryCompletedController {
  async update(req, res) {
    const schema = Yup.object().shape({
      end_date: Yup.date().required(),
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { deliverymanId, deliveryId } = req.params;

    const checkDeliveryman = await Deliveryman.findByPk(deliverymanId);
    if (!checkDeliveryman) {
      return res.status(400).json({ error: 'Invalid deliveryman' });
    }

    const delivery = await Deliverie.findOne({
      where: {
        id: deliveryId,
        end_date: null,
        signature_id: null,
      },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Invalid delivery' });
    }

    const { end_date, signature_id } = req.body;

    await delivery.update({
      end_date,
      signature_id,
    });

    return res.json(delivery);
  }
}

export default new DeliveryCompletedController();
