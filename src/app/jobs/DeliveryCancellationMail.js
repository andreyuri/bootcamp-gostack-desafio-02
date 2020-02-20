import Mail from '../../lib/Mail';

class DeliveryCancellationMail {
  get key() {
    return 'DeliveryCancellation';
  }

  async handle({ data }) {
    const { deliveryman, product } = data;

    await Mail.sendEmail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Entrega cancelada',
      template: 'deliveryCancellation',
      context: {
        deliveryman: deliveryman.name,
        product,
      },
    });
  }
}

export default new DeliveryCancellationMail();
