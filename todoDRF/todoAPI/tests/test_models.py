from django.test import TestCase
from todoAPI.models import Task
from datetime import date


class TaskModelTest(TestCase):
    def setUp(self):
        self.task = Task.objects.create(
            title="Django unit test", description="Learn about unit test", complete=True
        )

    def test_task_create(self):
        self.assertEqual(self.task.title, "Django unit test")
        self.assertEqual(self.task.description, "Learn about unit test")
        self.assertTrue(self.task.complete)
        # self.assertEqual(self.task.created,"2025-04-25")
        self.assertIsInstance(self.task.created, date)
