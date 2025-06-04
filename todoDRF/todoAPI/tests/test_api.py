from rest_framework.test import APITestCase
from todoAPI.models import Task
from django.urls import reverse
from rest_framework import status


class TaskAPITest(APITestCase):
    def setUp(self):
        self.task = Task.objects.create(
            title="Django unit test", description="Learn about unit test", complete=True
        )

    def test_task_get_status(self):
        url = reverse("get_task")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Task.objects.count(),1)

    def test_task_post_status(self):
        url = reverse("create_task")
        data = {
            "title": "Writing Test",
            "description": "this is the test",
            "complete": True,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(),2)
    
    def test_task_put_status(self):
        url = reverse("update_task", kwargs={"pk": self.task.id})
        update_data = {
            "title": "Writing Test for Django RESTAPI",
            "description": "this is the test",
            "complete": True,
        }
        response = self.client.put(url, update_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.task.refresh_from_db()
        self.assertEqual(self.task.title, "Writing Test for Django RESTAPI")