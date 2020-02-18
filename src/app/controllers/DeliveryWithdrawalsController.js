import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  setHours,
  isBefore,
  isAfter,
  setMinutes,
  setSeconds,
} from 'date-fns';
import Deliverie from '../models/Deliverie';

class DeliveryWithdrawalsController {
  async update(req, res) {
    const startHourAllowed = setSeconds(
      setMinutes(setHours(new Date(), 8), 0),
      0
    );
    const endHourAllowed = setSeconds(
      setMinutes(setHours(new Date(), 18), 0),
      0
    );
    const now = new Date(2020, 1, 18, 10, 21);

    if (isBefore(now, startHourAllowed) || isAfter(now, endHourAllowed)) {
      return res.status(400).json({
        error: 'Deliveries can be withdrawal between 08:00 and 18:00',
      });
    }

    const { deliverymanId, deliveryId } = req.params;

    const checkDeliveries = await Deliverie.findAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(now), endOfDay(now)],
        },
        deliveryman_id: deliverymanId,
      },
    });
    if (checkDeliveries && checkDeliveries.length >= 5) {
      return res
        .status(400)
        .json({ error: 'You can withdrawal only 5 deliveries per day.' });
    }

    const delivery = await Deliverie.findOne({
      where: {
        id: deliveryId,
        deliveryman_id: deliverymanId,
      },
    });
    if (!delivery) {
      return res.status(400).json({ error: 'This delivery does not exists' });
    }

    if (delivery.start_date) {
      return res
        .status(400)
        .json({ error: 'This delivery already gone withdrawal' });
    }

    await delivery.update({
      start_date: new Date(),
    });

    return res.json(delivery);
  }
}

export default new DeliveryWithdrawalsController();
