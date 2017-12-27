const express = require('express')
const router = express.Router()

const event_controller = require('../controllers/event_controller')

module.exports = () => {
    router.get('/', event_controller.get_events)

    router.get('/event/:id', event_controller.get_event)

    router.post('/event', event_controller.add_event)

    router.put('/event/modify-info', event_controller.modify_event_info)

    router.put('/event/modify-place', event_controller.modify_event_place)

    router.put('/event/modify-time', event_controller.modify_event_time)
    
    router.post('/event/add-user', event_controller.add_user_to_event)

    router.put('/event/modify-going', event_controller.modify_going_list)

    router.post('/event/remove-user', event_controller.remove_user_from_event)

    router.delete('/event/:id', event_controller.remove_event)

	return router;
}