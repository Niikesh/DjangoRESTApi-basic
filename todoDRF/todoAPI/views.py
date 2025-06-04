from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializer import TaskSerializer

# Create your views here.
@api_view(['GET'])
def get_task(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_task(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST', 'DELETE'])
def update_task(request, pk):
    try:
        tasks = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    
    if request.method == 'GET':
        serializer = TaskSerializer(tasks)
        return Response(serializer.data)
    
    if request.method == 'POST':
        serializer = TaskSerializer(instance=tasks, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        tasks.delete()
        return Response({'message': 'Task deleted successfully'}, status=204)