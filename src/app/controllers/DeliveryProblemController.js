import Deliverie from '../models/Deliverie';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveriesWithProblem = await Deliverie.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: DeliveryProblem,
          as: 'deliverieproblem',
          required: true,
          attributes: ['id', 'description'],
        },
      ],
      attributes: ['id', 'product', 'recipient_id', 'deliveryman_id'],
    });

    return res.json(deliveriesWithProblem);
  }
}

export default new DeliveryProblemController();
