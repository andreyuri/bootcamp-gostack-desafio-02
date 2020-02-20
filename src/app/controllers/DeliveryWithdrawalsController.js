import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  setHours,
  isBefore,
  isAfter,
  setMinutes,
  setSeconds,
  parseISO,
} from 'date-fns';
import * as Yup from 'yup';
import Deliverie from '../models/Deliverie';

class DeliveryWithdrawalsController {
  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { start_date } = req.body;
    const startDateFormatted = parseISO(start_date);

    const startHourAllowed = setSeconds(
      setMinutes(setHours(startDateFormatted, 8), 0),
      0
    );
    const endHourAllowed = setSeconds(
      setMinutes(setHours(startDateFormatted, 18), 0),
      0
    );

    if (
      isBefore(startDateFormatted, startHourAllowed) ||
      isAfter(startDateFormatted, endHourAllowed)
    ) {
      return res.status(400).json({
        error: 'Deliveries can be withdrawal between 08:00 and 18:00',
      });
    }

    const { deliverymanId, deliveryId } = req.params;

    const checkDeliveries = await Deliverie.findAll({
      where: {
        start_date: {
          [Op.between]: [
            startOfDay(startDateFormatted),
            endOfDay(startDateFormatted),
          ],
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
      start_date: startDateFormatted,
    });

    return res.json(delivery);
  }
}

export default new DeliveryWithdrawalsController();
