const { Transaction, Book } = require('../models');
const { Op } = require('sequelize');

exports.checkout = async (req,res,next)=>{
  try{
    const userId = req.user.id;
    const { bookId } = req.body;
    if(!bookId) return res.status(400).json({ message: 'bookId required' });
    const book = await Book.findByPk(bookId);
    if(!book) return res.status(404).json({ message: 'Book not found' });
    if(book.availableCopies < 1) return res.status(400).json({ message: 'No copies available' });
    // transaction: reduce copy and create transaction
    await book.decrement('availableCopies', { by: 1 });
    const checkoutDate = new Date();
    const dueDate = new Date(checkoutDate.getTime() + 14*24*60*60*1000);
    const tx = await Transaction.create({ userId, bookId, type: 'checkout', status: 'active', checkoutDate, dueDate });
    return res.status(201).json(tx);
  }catch(e){ next(e); }
};

exports.returnBook = async (req,res,next)=>{
  try{
    const userId = req.user.id;
    const { transactionId, bookId } = req.body;
    let tx;
    if(transactionId) tx = await Transaction.findByPk(transactionId);
    else if(bookId) tx = await Transaction.findOne({ where: { bookId, userId, type: 'checkout', status: 'active' } });
    if(!tx) return res.status(404).json({ message: 'Active checkout not found' });
    tx.returnDate = new Date();
    tx.status = 'completed';
    await tx.save();
    // increase available copies
    const book = await Book.findByPk(tx.bookId);
    if(book) await book.increment('availableCopies', { by: 1 });
    // create a return transaction record (optional). For simplicity update same record's type->return
    await Transaction.create({ userId, bookId: tx.bookId, type: 'return', status: 'completed', checkoutDate: null, returnDate: tx.returnDate });
    return res.json({ message: 'Returned', tx });
  }catch(e){ next(e); }
};

exports.userTransactions = async (req,res,next)=>{
  try{
    const userId = req.params.id;
    const txs = await Transaction.findAll({ where: { userId } });
    return res.json(txs);
  }catch(e){ next(e); }
};
