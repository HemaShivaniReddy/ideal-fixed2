import express from 'express'; import Idea from '../models/Idea.js'; import { auth, requireManager } from '../middleware/auth.js'; const router = express.Router();
router.post('/', auth, async (req,res)=>{ const {title,problemStatement,existingSolution,proposedSolution,expectedImpact} = req.body; if(!title||!problemStatement||!proposedSolution) return res.status(400).json({message:'Missing required fields'}); const idea = await Idea.create({title,problemStatement,existingSolution,proposedSolution,expectedImpact,createdBy:req.user.id}); res.status(201).json(idea); });
router.get('/my', auth, async (req,res)=>{ const ideas = await Idea.find({createdBy:req.user.id}).sort({createdAt:-1}); res.json(ideas); });
router.get('/all', auth, requireManager, async (req,res)=>{ const ideas = await Idea.find().populate('createdBy','name email').sort({createdAt:-1}); res.json(ideas); });
router.post('/:id/approve', auth, requireManager, async (req,res)=>{ const i = await Idea.findByIdAndUpdate(req.params.id,{status:'Approved'},{new:true}); if(!i) return res.status(404).json({message:'Not found'}); res.json(i); });
router.post('/:id/reject', auth, requireManager, async (req,res)=>{ const i = await Idea.findByIdAndUpdate(req.params.id,{status:'Rejected'},{new:true}); if(!i) return res.status(404).json({message:'Not found'}); res.json(i); });
export default router;
